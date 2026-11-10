using Promco.Models;

namespace Promco.Services
{
    /// <summary>Audit trail of every change made through the API. Feeds the daily report.</summary>
    public class ActivityService
    {
        private readonly IDataStore _store;

        public ActivityService(IDataStore store) => _store = store;

        public void Log(User user, string action, string entity, int? entityId, string summary)
        {
            _store.Add(Collections.Activity, new ActivityEntry
            {
                UserId = user.Id,
                Username = user.Username,
                Action = action,
                Entity = entity,
                EntityId = entityId,
                Summary = summary,
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
