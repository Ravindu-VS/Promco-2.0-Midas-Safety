using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/reports")]
    public class ReportsController : AppControllerBase
    {
        public ReportsController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        /// <summary>
        /// Converts a local calendar date to a UTC range. tzOffset is JavaScript's
        /// Date.getTimezoneOffset() (minutes, e.g. -330 for UTC+05:30).
        /// </summary>
        public static bool TryGetUtcRange(string date, int tzOffset, out DateTime start, out DateTime end)
        {
            start = end = default;
            if (!DateOnly.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var day))
                return false;
            start = DateTime.SpecifyKind(day.ToDateTime(TimeOnly.MinValue).AddMinutes(tzOffset), DateTimeKind.Utc);
            end = start.AddDays(1);
            return true;
        }

        // GET: api/reports/daily?date=2026-11-10&tzOffset=-330
        [HttpGet("daily")]
        public IActionResult Daily([FromQuery] string date, [FromQuery] int tzOffset = 0)
        {
            if (!TryGetUtcRange(date, tzOffset, out var start, out var end))
                return BadRequestMessage("date must be YYYY-MM-DD");

            var me = CurrentUser;
            bool InDay(DateTime? t) => t != null && t >= start && t < end;

            var machines = Store.All<Machine>(Collections.Machines);
            var machineNames = machines.ToDictionary(m => m.Id, m => $"{m.Name} ({m.Code})");
            string MachineName(int id) => machineNames.TryGetValue(id, out var n) ? n : $"Machine #{id} (deleted)";

            var faults = Store.All<MachineFault>(Collections.Faults);
            var maintenance = Store.All<MaintenanceRecord>(Collections.Maintenance);
            var activity = Store.All<ActivityEntry>(Collections.Activity).Where(a => InDay(a.Timestamp));
            var scope = me.IsManagerOrAdmin() ? "all users" : "your own activity";
            if (!me.IsManagerOrAdmin()) activity = activity.Where(a => a.UserId == me.Id);
            var activityList = activity.OrderBy(a => a.Timestamp).ToList();

            var openFaults = faults.Where(f => f.Status != FaultStatus.Resolved).ToList();
            object FaultRow(MachineFault f) => new
            {
                f.Id, machine = MachineName(f.MachineId), f.Priority, f.Status, f.Description,
                f.ReportedByName, f.ReportedAt, f.ResolvedByName, f.ResolvedAt, f.ResolutionNotes
            };
            object MaintenanceRow(MaintenanceRecord r) => new
            {
                r.Id, machine = MachineName(r.MachineId), r.MaintenanceType, r.Status, r.Description,
                r.ScheduledDate, r.TechnicianName, r.CompletedAt, r.Notes
            };

            var faultsReported = faults.Where(f => InDay(f.ReportedAt)).OrderBy(f => f.ReportedAt).ToList();
            var faultsResolved = faults.Where(f => InDay(f.ResolvedAt)).OrderBy(f => f.ResolvedAt).ToList();
            var maintenanceForDay = maintenance
                .Where(r => r.ScheduledDate == date || InDay(r.CompletedAt))
                .OrderBy(r => r.ScheduledDate).ThenBy(r => r.Id).ToList();

            return Ok(new
            {
                date,
                rangeStartUtc = start,
                rangeEndUtc = end,
                generatedAt = DateTime.UtcNow,
                generatedBy = new { me.Id, me.Username, me.Role },
                activityScope = scope,
                summary = new
                {
                    machinesTotal = machines.Count,
                    machinesByStatus = MachineStatus.All.ToDictionary(s => s, s => machines.Count(m => m.Status == s)),
                    openFaultsNow = openFaults.Count,
                    faultsReported = faultsReported.Count,
                    faultsResolved = faultsResolved.Count,
                    maintenanceScheduled = maintenance.Count(r => r.ScheduledDate == date),
                    maintenanceCompleted = maintenance.Count(r => InDay(r.CompletedAt)),
                    activityCount = activityList.Count,
                    activeUsers = activityList.Select(a => a.UserId).Distinct().Count()
                },
                machines = machines.OrderBy(m => m.Name).Select(m => new
                {
                    m.Id, m.Name, m.Code, m.Status,
                    openFaults = openFaults.Count(f => f.MachineId == m.Id)
                }),
                faultsReported = faultsReported.Select(FaultRow),
                faultsResolved = faultsResolved.Select(FaultRow),
                openFaults = openFaults.OrderByDescending(f => f.ReportedAt).Select(FaultRow),
                maintenance = maintenanceForDay.Select(MaintenanceRow),
                activity = activityList.Select(a => new { a.Timestamp, a.Username, a.Action, a.Entity, a.Summary })
            });
        }
    }
}
