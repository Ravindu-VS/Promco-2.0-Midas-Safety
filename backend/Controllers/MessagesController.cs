using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    /// <summary>"Contact Admin" messages. Admins see all of them; everyone else sees their own.</summary>
    [Route("api/messages")]
    public class MessagesController : AppControllerBase
    {
        public MessagesController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        [HttpGet]
        public IActionResult Get()
        {
            var me = CurrentUser;
            var messages = Store.All<AdminMessage>(Collections.Messages).AsEnumerable();
            if (me.Role != Roles.Admin) messages = messages.Where(m => m.FromUserId == me.Id);
            return Ok(messages.OrderByDescending(m => m.CreatedAt));
        }

        [HttpPost]
        public IActionResult Send([FromBody] MessageCreateRequest request)
        {
            var subject = Clean(request.Subject);
            var body = Clean(request.Body);
            if (body.Length == 0) return BadRequestMessage("Message cannot be empty");
            if (body.Length > 2000) return BadRequestMessage("Message is too long (max 2000 characters)");
            if (subject.Length == 0) subject = body.Length > 60 ? body[..60] + "…" : body;

            var me = CurrentUser;
            var message = Store.Add(Collections.Messages, new AdminMessage
            {
                FromUserId = me.Id,
                FromUsername = me.Username,
                Subject = subject,
                Body = body,
                CreatedAt = DateTime.UtcNow
            });

            Activity.Log(me, "sent", "message", message.Id, $"Sent a message to the admins: {subject}");
            Notifications.Notify("message", $"New message from {me.Username}", subject, "/messages",
                roles: new[] { Roles.Admin }, excludeUserId: me.Id);
            return StatusCode(201, message);
        }

        // PUT: api/messages/3/resolve  (admin) - optional reply is sent back to the user
        [HttpPut("{id:int}/resolve")]
        [Authorize(Roles = "admin")]
        public IActionResult Resolve(int id, [FromBody] MessageResolveRequest request)
        {
            var message = Store.Find<AdminMessage>(Collections.Messages, id);
            if (message == null) return NotFoundMessage("Message not found");
            if (message.Status == "Resolved") return Ok(message);

            var me = CurrentUser;
            message.Status = "Resolved";
            message.Reply = string.IsNullOrWhiteSpace(request.Reply) ? null : Clean(request.Reply);
            message.ResolvedBy = me.Id;
            message.ResolvedByName = me.Username;
            message.ResolvedAt = DateTime.UtcNow;
            var saved = Store.Save(Collections.Messages, id, message)!;

            Activity.Log(me, "resolved", "message", id, $"Resolved message from {message.FromUsername}: {message.Subject}");
            Notifications.Notify("message", "Your message was answered",
                message.Reply != null ? $"{me.Username}: {message.Reply}" : $"{me.Username} marked \"{message.Subject}\" as resolved.",
                "/messages", userIds: new[] { message.FromUserId }, excludeUserId: me.Id);
            return Ok(saved);
        }
    }
}
