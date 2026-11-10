using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api")]
    public class FaultsController : AppControllerBase
    {
        public FaultsController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/faults?status=Open&machineId=3
        [HttpGet("faults")]
        public IActionResult GetAll([FromQuery] string? status, [FromQuery] int? machineId)
        {
            var faults = Store.All<MachineFault>(Collections.Faults).AsEnumerable();
            if (!string.IsNullOrWhiteSpace(status)) faults = faults.Where(f => f.Status == status);
            if (machineId != null) faults = faults.Where(f => f.MachineId == machineId);
            return Ok(faults.OrderByDescending(f => f.ReportedAt));
        }

        // GET: api/machines/3/faults
        [HttpGet("machines/{machineId:int}/faults")]
        public IActionResult GetForMachine(int machineId) => GetAll(null, machineId);

        // POST: api/machines/3/faults  - any signed-in user can report a fault
        [HttpPost("machines/{machineId:int}/faults")]
        public IActionResult Report(int machineId, [FromBody] FaultCreateRequest request)
        {
            var machine = Store.Find<Machine>(Collections.Machines, machineId);
            if (machine == null) return NotFoundMessage("Machine not found");

            var description = Clean(request.Description);
            if (description.Length < 5) return BadRequestMessage("Please describe the fault (at least 5 characters)");
            var priority = string.IsNullOrWhiteSpace(request.Priority) ? "Medium" : Clean(request.Priority);
            if (!FaultPriority.All.Contains(priority)) return BadRequestMessage("Invalid priority");

            var me = CurrentUser;
            var fault = Store.Add(Collections.Faults, new MachineFault
            {
                MachineId = machineId,
                Description = description,
                Priority = priority,
                Status = FaultStatus.Open,
                ReportedBy = me.Id,
                ReportedByName = me.Username,
                ReportedAt = DateTime.UtcNow
            });

            Activity.Log(me, "reported", "fault", fault.Id, $"Reported {priority} fault #{fault.Id} on {machine.Name}: {description}");
            Notifications.Notify("fault", $"{priority} fault reported on {machine.Name}",
                $"{me.Username}: {description}", "/faults",
                roles: new[] { Roles.Admin, Roles.Manager, Roles.Technician }, excludeUserId: me.Id);

            return StatusCode(201, fault);
        }

        // PUT: api/faults/7/status  - technicians, managers and admins work on faults
        [HttpPut("faults/{id:int}/status")]
        [Authorize(Roles = "admin,manager,technician")]
        public IActionResult UpdateStatus(int id, [FromBody] FaultStatusRequest request)
        {
            var fault = Store.Find<MachineFault>(Collections.Faults, id);
            if (fault == null) return NotFoundMessage("Fault not found");

            var status = Clean(request.Status);
            if (!FaultStatus.All.Contains(status)) return BadRequestMessage("Invalid status");
            if (status == fault.Status) return Ok(fault);
            if (status == FaultStatus.Resolved && string.IsNullOrWhiteSpace(request.ResolutionNotes))
                return BadRequestMessage("Resolution notes are required to resolve a fault");

            var me = CurrentUser;
            var previous = fault.Status;
            fault.Status = status;
            fault.UpdatedAt = DateTime.UtcNow;
            if (status == FaultStatus.Resolved)
            {
                fault.ResolvedBy = me.Id;
                fault.ResolvedByName = me.Username;
                fault.ResolvedAt = DateTime.UtcNow;
                fault.ResolutionNotes = Clean(request.ResolutionNotes);
            }
            else
            {
                fault.ResolvedBy = null;
                fault.ResolvedByName = null;
                fault.ResolvedAt = null;
                if (request.ResolutionNotes != null) fault.ResolutionNotes = Clean(request.ResolutionNotes);
            }
            var saved = Store.Save(Collections.Faults, id, fault)!;

            var machineName = Store.Find<Machine>(Collections.Machines, fault.MachineId)?.Name ?? $"machine #{fault.MachineId}";
            Activity.Log(me, status == FaultStatus.Resolved ? "resolved" : "updated", "fault", id,
                $"Fault #{id} on {machineName}: {previous} -> {status}");
            Notifications.Notify("fault", $"Fault #{id} is now {status}",
                $"{me.Username} changed your fault report on {machineName} to {status}." +
                (status == FaultStatus.Resolved ? $" Notes: {saved.ResolutionNotes}" : ""),
                "/faults", userIds: new[] { fault.ReportedBy }, excludeUserId: me.Id);

            return Ok(saved);
        }

        // DELETE: api/faults/7  (admin)
        [HttpDelete("faults/{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var fault = Store.Find<MachineFault>(Collections.Faults, id);
            if (fault == null) return NotFoundMessage("Fault not found");
            if (Store.All<MaintenanceRecord>(Collections.Maintenance).Any(r => r.FaultId == id))
                return Error(409, "This fault is linked to a maintenance record; remove the link or the record first");
            Store.Delete(Collections.Faults, id);
            Activity.Log(CurrentUser, "deleted", "fault", id, $"Deleted fault report #{id}");
            return Ok(new { message = "Fault report deleted" });
        }
    }
}
