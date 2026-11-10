namespace Promco.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public string Type { get; set; } = "info";
        public string? Link { get; set; }
        /// <summary>Recipients, resolved when the notification is created.</summary>
        public List<int> UserIds { get; set; } = new List<int>();
        public List<int> ReadBy { get; set; } = new List<int>();
        public DateTime CreatedAt { get; set; }
    }

    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = "";
        public string Message { get; set; } = "";
        public string Type { get; set; } = "";
        public string? Link { get; set; }
        public bool Read { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class ActivityEntry
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = "";
        public string Action { get; set; } = "";
        public string Entity { get; set; } = "";
        public int? EntityId { get; set; }
        public string Summary { get; set; } = "";
        public DateTime Timestamp { get; set; }
    }

    public class AdminMessage
    {
        public int Id { get; set; }
        public int FromUserId { get; set; }
        public string FromUsername { get; set; } = "";
        public string Subject { get; set; } = "";
        public string Body { get; set; } = "";
        public string Status { get; set; } = "Open";
        public string? Reply { get; set; }
        public int? ResolvedBy { get; set; }
        public string? ResolvedByName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
    }

    public class MessageCreateRequest
    {
        public string? Subject { get; set; }
        public string? Body { get; set; }
    }

    public class MessageResolveRequest
    {
        public string? Reply { get; set; }
    }
}
