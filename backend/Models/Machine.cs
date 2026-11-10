namespace Promco.Models
{
    public static class MachineStatus
    {
        public const string Operational = "Operational";
        public const string UnderMaintenance = "Under Maintenance";
        public const string Faulty = "Faulty";
        public const string Inactive = "Inactive";

        public static readonly string[] All = { Operational, UnderMaintenance, Faulty, Inactive };
    }

    public class Machine
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Code { get; set; } = "";
        public int? MachineTypeId { get; set; }
        public int? MainSectionId { get; set; }
        public int? SubSectionId { get; set; }
        public int? PlantDepartmentId { get; set; }
        public string? SapResource { get; set; }
        public string? SerialNumber { get; set; }
        public string? Manufacturer { get; set; }
        public string? ModelNumber { get; set; }
        public int? ManufactureYear { get; set; }
        public string? InstallDate { get; set; }
        public string Status { get; set; } = MachineStatus.Operational;
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }

    public class MachineRequest
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public int? MachineTypeId { get; set; }
        public int? MainSectionId { get; set; }
        public int? SubSectionId { get; set; }
        public int? PlantDepartmentId { get; set; }
        public string? SapResource { get; set; }
        public string? SerialNumber { get; set; }
        public string? Manufacturer { get; set; }
        public string? ModelNumber { get; set; }
        public int? ManufactureYear { get; set; }
        public string? InstallDate { get; set; }
        public string? Status { get; set; }
    }
}
