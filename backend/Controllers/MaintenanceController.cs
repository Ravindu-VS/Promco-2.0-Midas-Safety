using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api")]
    public class MaintenanceController : AppControllerBase
    {
        public MaintenanceController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/maintenance?status=Scheduled&machineId=3
        [HttpGet("maintenance")]
        public IActionResult GetAll([FromQuery] string? status, [FromQuery] int? machineId)
        {
            var records = Store.All<MaintenanceRecord>(Collections.Maintenance).AsEnumerable();
            if (!string.IsNullOrWhiteSpace(status)) records = records.Where(r => r.Status == status);
            if (machineId != null) records = records.Where(r => r.MachineId == machineId);
            return Ok(records.OrderByDescending(r => r.ScheduledDate).ThenByDescending(r => r.Id));
        }

        // GET: api/machines/3/maintenance
        [HttpGet("machines/{machineId:int}/maintenance")]
        public IActionResult GetForMachine(int machineId) => GetAll(null, machineId);

        // POST: api/machines/3/maintenance
        [HttpPost("machines/{machineId:int}/maintenance")]
        [Authorize(Roles = "admin,manager,technician")]
        public IActionResult Schedule(int machineId, [FromBody] MaintenanceRequest request)
        {
            var machine = Store.Find<Machine>(Collections.Machines, machineId);
            if (machine == null) return NotFoundMessage("Machine not found");

            var record = new MaintenanceRecord
            {
                MachineId = machineId,
                Status = MaintenanceStatus.Scheduled,
                CreatedBy = CurrentUser.Id,
                CreatedByName = CurrentUser.Username,
                CreatedAt = DateTime.UtcNow
            };
            var error = Apply(record, request, isNew: true);
            if (error != null) return BadRequestMessage(error);

            var created = Store.Add(Collections.Maintenance, record);
            SyncMachineStatus(machineId);

            var me = CurrentUser;
            Activity.Log(me, "scheduled", "maintenance", created.Id,
                $"Scheduled {created.MaintenanceType} maintenance #{created.Id} for {machine.Name} on {created.ScheduledDate}");
            Notifications.Notify("maintenance", $"Maintenance scheduled: {machine.Name}",
                $"{created.MaintenanceType} on {created.ScheduledDate}" +
                (created.TechnicianName != null ? $", assigned to {created.TechnicianName}" : "") + $". {created.Description}",
                "/maintenance",
                userIds: created.TechnicianId != null ? new[] { created.TechnicianId.Value } : null,
                roles: new[] { Roles.Manager }, excludeUserId: me.Id);

            return StatusCode(201, created);
        }

        // PUT: api/maintenance/4
        [HttpPut("maintenance/{id:int}")]
        [Authorize(Roles = "admin,manager,technician")]
        public IActionResult Update(int id, [FromBody] MaintenanceRequest request)
        {
            var record = Store.Find<MaintenanceRecord>(Collections.Maintenance, id);
            if (record == null) return NotFoundMessage("Maintenance record not found");

            var previousStatus = record.Status;
            var error = Apply(record, request, isNew: false);
            if (error != null) return BadRequestMessage(error);

            record.UpdatedAt = DateTime.UtcNow;
            if (record.Status == MaintenanceStatus.Completed && previousStatus != MaintenanceStatus.Completed)
                record.CompletedAt = DateTime.UtcNow;
            if (record.Status != MaintenanceStatus.Completed) record.CompletedAt = null;

            var saved = Store.Save(Collections.Maintenance, id, record)!;
            SyncMachineStatus(saved.MachineId);

            var me = CurrentUser;
            var machineName = Store.Find<Machine>(Collections.Machines, saved.MachineId)?.Name ?? $"machine #{saved.MachineId}";
            var summary = previousStatus != saved.Status
                ? $"Maintenance #{id} on {machineName}: {previousStatus} -> {saved.Status}"
                : $"Updated maintenance #{id} on {machineName}";
            Activity.Log(me, saved.Status == MaintenanceStatus.Completed && previousStatus != saved.Status ? "completed" : "updated",
                "maintenance", id, summary);

            if (previousStatus != saved.Status)
            {
                var recipients = new List<int> { saved.CreatedBy };
                if (saved.TechnicianId != null) recipients.Add(saved.TechnicianId.Value);
                Notifications.Notify("maintenance", $"Maintenance #{id} is now {saved.Status}",
                    $"{me.Username} updated {saved.MaintenanceType} maintenance on {machineName}.", "/maintenance",
                    userIds: recipients, roles: new[] { Roles.Manager }, excludeUserId: me.Id);
            }
            return Ok(saved);
        }

        // DELETE: api/maintenance/4
        [HttpDelete("maintenance/{id:int}")]
        [Authorize(Roles = "admin,manager")]
        public IActionResult Delete(int id)
        {
            var record = Store.Find<MaintenanceRecord>(Collections.Maintenance, id);
            if (record == null) return NotFoundMessage("Maintenance record not found");
            Store.Delete(Collections.Maintenance, id);
            SyncMachineStatus(record.MachineId);
            Activity.Log(CurrentUser, "deleted", "maintenance", id, $"Deleted maintenance record #{id}");
            return Ok(new { message = "Maintenance record deleted" });
        }

        private string? Apply(MaintenanceRecord record, MaintenanceRequest request, bool isNew)
        {
            if (isNew || request.MaintenanceType != null)
            {
                var type = string.IsNullOrWhiteSpace(request.MaintenanceType) ? "Preventive" : Clean(request.MaintenanceType);
                if (!MaintenanceTypes.All.Contains(type)) return "Invalid maintenance type";
                record.MaintenanceType = type;
            }
            if (isNew || request.Description != null)
            {
                record.Description = Clean(request.Description);
                if (record.Description.Length == 0) return "Description is required";
            }
            if (isNew || request.ScheduledDate != null)
            {
                if (!IsValidDate(request.ScheduledDate)) return "Scheduled date must be YYYY-MM-DD";
                record.ScheduledDate = request.ScheduledDate!;
            }
            if (request.Status != null)
            {
                var status = Clean(request.Status);
                if (!MaintenanceStatus.All.Contains(status)) return "Invalid status";
                record.Status = status;
            }
            if (request.Notes != null) record.Notes = Clean(request.Notes);

            if (isNew || request.TechnicianId != null)
            {
                if (request.TechnicianId == null || request.TechnicianId == 0)
                {
                    record.TechnicianId = null;
                    record.TechnicianName = null;
                }
                else
                {
                    var tech = Store.Find<User>(Collections.Users, request.TechnicianId.Value);
                    if (tech == null) return "Selected technician does not exist";
                    record.TechnicianId = tech.Id;
                    record.TechnicianName = tech.Username;
                }
            }
            if (isNew || request.FaultId != null)
            {
                if (request.FaultId == null || request.FaultId == 0) record.FaultId = null;
                else
                {
                    var fault = Store.Find<MachineFault>(Collections.Faults, request.FaultId.Value);
                    if (fault == null || fault.MachineId != record.MachineId) return "Linked fault does not belong to this machine";
                    record.FaultId = fault.Id;
                }
            }
            return null;
        }

        /// <summary>
        /// A machine with maintenance "In Progress" is "Under Maintenance"; when no work is in progress
        /// any more it goes back to "Operational" (Faulty/Inactive set by hand are left alone).
        /// </summary>
        private void SyncMachineStatus(int machineId)
        {
            var machine = Store.Find<Machine>(Collections.Machines, machineId);
            if (machine == null) return;
            var inProgress = Store.All<MaintenanceRecord>(Collections.Maintenance)
                .Any(r => r.MachineId == machineId && r.Status == MaintenanceStatus.InProgress);

            var newStatus = machine.Status;
            if (inProgress) newStatus = MachineStatus.UnderMaintenance;
            else if (machine.Status == MachineStatus.UnderMaintenance) newStatus = MachineStatus.Operational;

            if (newStatus != machine.Status)
            {
                machine.Status = newStatus;
                machine.ModifiedAt = DateTime.UtcNow;
                Store.Save(Collections.Machines, machineId, machine);
            }
        }
    }
}
