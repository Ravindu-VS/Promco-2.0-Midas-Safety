namespace Promco.Models
{
    public static class FaultStatus
    {
        public const string Open = "Open";
        public const string InProgress = "In Progress";
        public const string Resolved = "Resolved";

        public static readonly string[] All = { Open, InProgress, Resolved };
    }

    public static class FaultPriority
    {
        public static readonly string[] All = { "Low", "Medium", "High", "Critical" };
    }

    public class MachineFault
    {
        public int Id { get; set; }
        public int MachineId { get; set; }
        public string Description { get; set; } = "";
        public string Priority { get; set; } = "Medium";
        public string Status { get; set; } = FaultStatus.Open;
        public int ReportedBy { get; set; }
        public string ReportedByName { get; set; } = "";
        public DateTime ReportedAt { get; set; }
        public int? ResolvedBy { get; set; }
        public string? ResolvedByName { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public string? ResolutionNotes { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class FaultCreateRequest
    {
        public string? Description { get; set; }
        public string? Priority { get; set; }
    }

    public class FaultStatusRequest
    {
        public string? Status { get; set; }
        public string? ResolutionNotes { get; set; }
    }
}
