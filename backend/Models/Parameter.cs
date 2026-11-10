namespace Promco.Models
{
    /// <summary>A recorded reading for a parameter defined in master data ("parameters").</summary>
    public class ParameterValue
    {
        public int Id { get; set; }
        public int ParameterId { get; set; }
        public int? MachineId { get; set; }
        public string Value { get; set; } = "";
        public int RecordedBy { get; set; }
        public string RecordedByName { get; set; } = "";
        public DateTime RecordedAt { get; set; }
    }

    public class ParameterValueCreateRequest
    {
        public string? Value { get; set; }
        public int? MachineId { get; set; }
    }
}
