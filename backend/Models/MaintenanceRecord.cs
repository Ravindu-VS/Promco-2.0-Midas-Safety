namespace Promco.Models
{
    public static class MaintenanceStatus
    {
        public const string Scheduled = "Scheduled";
        public const string InProgress = "In Progress";
        public const string Completed = "Completed";
        public const string Cancelled = "Cancelled";

        public static readonly string[] All = { Scheduled, InProgress, Completed, Cancelled };
    }

    public static class MaintenanceTypes
    {
        public static readonly string[] All = { "Preventive", "Corrective", "Inspection" };
    }

    public class MaintenanceRecord
    {
        public int Id { get; set; }
        public int MachineId { get; set; }
        public int? FaultId { get; set; }
        public string MaintenanceType { get; set; } = "Preventive";
        public string Description { get; set; } = "";
        public int? TechnicianId { get; set; }
        public string? TechnicianName { get; set; }
        public string ScheduledDate { get; set; } = "";
        public string Status { get; set; } = MaintenanceStatus.Scheduled;
        public string? Notes { get; set; }
        public int CreatedBy { get; set; }
        public string CreatedByName { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class MaintenanceRequest
    {
        public int? FaultId { get; set; }
        public string? MaintenanceType { get; set; }
        public string? Description { get; set; }
        public int? TechnicianId { get; set; }
        public string? ScheduledDate { get; set; }
        public string? Status { get; set; }
        public string? Notes { get; set; }
    }
}
