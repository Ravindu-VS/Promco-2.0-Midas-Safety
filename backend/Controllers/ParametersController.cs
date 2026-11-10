using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    /// <summary>Readings recorded against parameters defined in master data.</summary>
    [Route("api/parameters")]
    public class ParametersController : AppControllerBase
    {
        public ParametersController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/parameters/2/values
        [HttpGet("{id:int}/values")]
        public IActionResult GetValues(int id)
        {
            if (Store.Get(Collections.MasterData("parameters"), id) == null) return NotFoundMessage("Parameter not found");
            return Ok(Store.All<ParameterValue>(Collections.ParameterValues)
                .Where(v => v.ParameterId == id).OrderByDescending(v => v.RecordedAt));
        }

        // POST: api/parameters/2/values
        [HttpPost("{id:int}/values")]
        [Authorize(Roles = "admin,manager,technician,operator")]
        public IActionResult AddValue(int id, [FromBody] ParameterValueCreateRequest request)
        {
            var parameter = Store.Get(Collections.MasterData("parameters"), id);
            if (parameter == null) return NotFoundMessage("Parameter not found");
            var value = Clean(request.Value);
            if (value.Length == 0) return BadRequestMessage("Value is required");
            if (request.MachineId != null && Store.Get(Collections.Machines, request.MachineId.Value) == null)
                return BadRequestMessage("Machine not found");

            var me = CurrentUser;
            var saved = Store.Add(Collections.ParameterValues, new ParameterValue
            {
                ParameterId = id,
                MachineId = request.MachineId,
                Value = value,
                RecordedBy = me.Id,
                RecordedByName = me.Username,
                RecordedAt = DateTime.UtcNow
            });
            Activity.Log(me, "recorded", "parameter-value", saved.Id,
                $"Recorded {parameter.GetString("name")} = {value} {parameter.GetString("unit")}".Trim());
            return StatusCode(201, saved);
        }
    }
}
