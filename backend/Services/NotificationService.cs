using Promco.Models;

namespace Promco.Services
{
    /// <summary>Creates notifications for real events (faults, maintenance, messages, account changes).</summary>
    public class NotificationService
    {
        private readonly IDataStore _store;

        public NotificationService(IDataStore store) => _store = store;

        /// <summary>
        /// Recipients are resolved when the event happens: explicit user ids plus everyone who
        /// currently has one of the roles (so people added later do not receive old alerts).
        /// </summary>
        public void Notify(string type, string title, string message, string? link,
            IEnumerable<int>? userIds = null, IEnumerable<string>? roles = null, int? excludeUserId = null)
        {
            var roleList = (roles ?? Enumerable.Empty<string>()).ToList();
            var recipients = (userIds ?? Enumerable.Empty<int>()).ToList();
            if (roleList.Count > 0)
            {
                recipients.AddRange(_store.All<User>(Collections.Users)
                    .Where(u => roleList.Contains(u.Role)).Select(u => u.Id));
            }
            var ids = recipients.Where(id => id != excludeUserId).Distinct().ToList();
            if (ids.Count == 0) return;

            _store.Add(Collections.Notifications, new Notification
            {
                Type = type,
                Title = title,
                Message = message,
                Link = link,
                UserIds = ids,
                CreatedAt = DateTime.UtcNow
            });
        }

        public static bool IsRecipient(Notification n, User user) => n.UserIds.Contains(user.Id);

        public List<Notification> ForUser(User user) =>
            _store.All<Notification>(Collections.Notifications)
                .Where(n => IsRecipient(n, user))
                .OrderByDescending(n => n.CreatedAt)
                .ToList();
    }
}
