using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/notifications")]
    public class NotificationsController : AppControllerBase
    {
        public NotificationsController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/notifications?limit=30
        [HttpGet]
        public IActionResult Mine([FromQuery] int limit = 30)
        {
            var me = CurrentUser;
            var all = Notifications.ForUser(me);
            return Ok(new
            {
                unread = all.Count(n => !n.ReadBy.Contains(me.Id)),
                items = all.Take(Math.Clamp(limit, 1, 200)).Select(n => new NotificationDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Message = n.Message,
                    Type = n.Type,
                    Link = n.Link,
                    Read = n.ReadBy.Contains(me.Id),
                    CreatedAt = n.CreatedAt
                })
            });
        }

        // POST: api/notifications/4/read
        [HttpPost("{id:int}/read")]
        public IActionResult MarkRead(int id)
        {
            var me = CurrentUser;
            var n = Store.Find<Notification>(Collections.Notifications, id);
            if (n == null || !NotificationService.IsRecipient(n, me)) return NotFoundMessage("Notification not found");
            if (!n.ReadBy.Contains(me.Id))
            {
                n.ReadBy.Add(me.Id);
                Store.Save(Collections.Notifications, id, n);
            }
            return Ok(new { message = "Marked as read" });
        }

        // POST: api/notifications/read-all
        [HttpPost("read-all")]
        public IActionResult MarkAllRead()
        {
            var me = CurrentUser;
            var count = 0;
            foreach (var n in Notifications.ForUser(me).Where(n => !n.ReadBy.Contains(me.Id)))
            {
                n.ReadBy.Add(me.Id);
                Store.Save(Collections.Notifications, n.Id, n);
                count++;
            }
            return Ok(new { message = "All notifications marked as read", count });
        }
    }
}
