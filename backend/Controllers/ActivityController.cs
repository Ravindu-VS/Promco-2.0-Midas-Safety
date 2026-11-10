using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/activity")]
    public class ActivityController : AppControllerBase
    {
        public ActivityController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/activity?date=2026-11-10&tzOffset=-330&limit=50
        // Admins/managers see everyone's activity, other roles only their own.
        [HttpGet]
        public IActionResult Get([FromQuery] string? date, [FromQuery] int tzOffset = 0, [FromQuery] int limit = 100)
        {
            var me = CurrentUser;
            var entries = Store.All<ActivityEntry>(Collections.Activity).AsEnumerable();
            if (!me.IsManagerOrAdmin()) entries = entries.Where(a => a.UserId == me.Id);

            if (!string.IsNullOrWhiteSpace(date))
            {
                if (!ReportsController.TryGetUtcRange(date, tzOffset, out var start, out var end))
                    return BadRequestMessage("date must be YYYY-MM-DD");
                entries = entries.Where(a => a.Timestamp >= start && a.Timestamp < end);
            }
            return Ok(entries.OrderByDescending(a => a.Timestamp).Take(Math.Clamp(limit, 1, 1000)));
        }
    }
}
