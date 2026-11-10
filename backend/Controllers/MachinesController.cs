using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/machines")]
    public class MachinesController : AppControllerBase
    {
        public MachinesController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/machines
        [HttpGet]
        public IActionResult GetAll() => Ok(Store.All<Machine>(Collections.Machines).OrderBy(m => m.Name));

        // GET: api/machines/5
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var machine = Store.Find<Machine>(Collections.Machines, id);
            return machine == null ? NotFoundMessage("Machine not found") : Ok(machine);
        }

        // POST: api/machines
        [HttpPost]
        [Authorize(Roles = "admin,manager")]
        public IActionResult Create([FromBody] MachineRequest request)
        {
            var machine = new Machine { CreatedBy = CurrentUser.Id, CreatedAt = DateTime.UtcNow };
            var error = Apply(machine, request, isNew: true);
            if (error != null) return BadRequestMessage(error);

            var created = Store.Add(Collections.Machines, machine);
            Activity.Log(CurrentUser, "created", "machine", created.Id, $"Added machine {created.Name} ({created.Code})");
            return StatusCode(201, created);
        }

        // PUT: api/machines/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin,manager")]
        public IActionResult Update(int id, [FromBody] MachineRequest request)
        {
            var machine = Store.Find<Machine>(Collections.Machines, id);
            if (machine == null) return NotFoundMessage("Machine not found");

            var previousStatus = machine.Status;
            var error = Apply(machine, request, isNew: false);
            if (error != null) return BadRequestMessage(error);

            machine.ModifiedBy = CurrentUser.Id;
            machine.ModifiedAt = DateTime.UtcNow;
            var saved = Store.Save(Collections.Machines, id, machine)!;

            var summary = previousStatus != saved.Status
                ? $"Updated machine {saved.Name}; status {previousStatus} -> {saved.Status}"
                : $"Updated machine {saved.Name}";
            Activity.Log(CurrentUser, "updated", "machine", id, summary);
            return Ok(saved);
        }

        // DELETE: api/machines/5  - also removes its fault reports and maintenance records
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var machine = Store.Find<Machine>(Collections.Machines, id);
            if (machine == null) return NotFoundMessage("Machine not found");

            var faults = Store.All<MachineFault>(Collections.Faults).Where(f => f.MachineId == id).ToList();
            var records = Store.All<MaintenanceRecord>(Collections.Maintenance).Where(r => r.MachineId == id).ToList();
            foreach (var f in faults) Store.Delete(Collections.Faults, f.Id);
            foreach (var r in records) Store.Delete(Collections.Maintenance, r.Id);
            Store.Delete(Collections.Machines, id);

            Activity.Log(CurrentUser, "deleted", "machine", id,
                $"Deleted machine {machine.Name} with {faults.Count} fault report(s) and {records.Count} maintenance record(s)");
            return Ok(new { message = "Machine deleted", deletedFaults = faults.Count, deletedMaintenance = records.Count });
        }

        private string? Apply(Machine machine, MachineRequest request, bool isNew)
        {
            if (isNew || request.Name != null) machine.Name = Clean(request.Name);
            if (isNew || request.Code != null) machine.Code = Clean(request.Code).ToUpperInvariant();
            if (machine.Name.Length == 0) return "Machine name is required";
            if (machine.Code.Length == 0) return "Machine code is required";

            var duplicate = Store.All<Machine>(Collections.Machines)
                .Any(m => m.Id != machine.Id && m.Code.Equals(machine.Code, StringComparison.OrdinalIgnoreCase));
            if (duplicate) return $"Machine code {machine.Code} is already used";

            if (isNew || request.Status != null)
            {
                var status = string.IsNullOrWhiteSpace(request.Status) ? MachineStatus.Operational : Clean(request.Status);
                if (!MachineStatus.All.Contains(status)) return "Invalid status";
                machine.Status = status;
            }

            machine.MachineTypeId = request.MachineTypeId;
            machine.MainSectionId = request.MainSectionId;
            machine.SubSectionId = request.SubSectionId;
            machine.PlantDepartmentId = request.PlantDepartmentId;
            foreach (var (field, value) in new[]
                     {
                         ("machineTypeId", request.MachineTypeId), ("mainSectionId", request.MainSectionId),
                         ("subSectionId", request.SubSectionId), ("plantDepartmentId", request.PlantDepartmentId)
                     })
            {
                if (value != null && Store.Get(MasterDataSchema.References[field], value.Value) == null)
                    return $"Selected {field.Replace("Id", "")} does not exist";
            }

            machine.SapResource = request.SapResource?.Trim();
            machine.SerialNumber = request.SerialNumber?.Trim();
            machine.Manufacturer = request.Manufacturer?.Trim();
            machine.ModelNumber = request.ModelNumber?.Trim();
            if (request.ManufactureYear != null && (request.ManufactureYear < 1950 || request.ManufactureYear > DateTime.UtcNow.Year))
                return "Manufacture year is not valid";
            machine.ManufactureYear = request.ManufactureYear;
            if (!string.IsNullOrWhiteSpace(request.InstallDate) && !IsValidDate(request.InstallDate))
                return "Install date must be YYYY-MM-DD";
            machine.InstallDate = string.IsNullOrWhiteSpace(request.InstallDate) ? null : request.InstallDate;
            return null;
        }
    }
}
