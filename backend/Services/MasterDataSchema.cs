namespace Promco.Services
{
    public class MasterDataTable
    {
        public string Name { get; init; } = "";
        public string Label { get; init; } = "";
        /// <summary>Field used when other records display a reference to this table.</summary>
        public string DisplayField { get; init; } = "name";
        public string[] Fields { get; init; } = Array.Empty<string>();
        public string[] Required { get; init; } = Array.Empty<string>();
        public string[] Numeric { get; init; } = Array.Empty<string>();
        /// <summary>Unique (case-insensitive) within the table.</summary>
        public string[] Unique { get; init; } = Array.Empty<string>();
        /// <summary>(min, max) pairs that must satisfy min &lt;= max.</summary>
        public (string Min, string Max)[] Ranges { get; init; } = Array.Empty<(string, string)>();
    }

    /// <summary>
    /// Server-side definition of the master data tables: allowed fields, required fields
    /// and references between tables (validated on save, enforced on delete).
    /// </summary>
    public static class MasterDataSchema
    {
        /// <summary>Reference field name -> collection it points to.</summary>
        public static readonly Dictionary<string, string> References = new Dictionary<string, string>
        {
            ["plantDepartmentId"] = Collections.MasterData("plant-departments"),
            ["machineTypeId"] = Collections.MasterData("machine-types"),
            ["mainSectionId"] = Collections.MasterData("main-sections"),
            ["subSectionId"] = Collections.MasterData("sub-sections"),
            ["materialCodeId"] = Collections.MasterData("material-codes"),
            ["parameterId"] = Collections.MasterData("parameters"),
            ["toleranceId"] = Collections.MasterData("tolerances"),
            ["userId"] = Collections.Users,
        };

        public static readonly Dictionary<string, MasterDataTable> Tables = new MasterDataTable[]
        {
            new MasterDataTable
            {
                Name = "plant-departments", Label = "Plant Department", DisplayField = "departmentName",
                Fields = new[] { "plantCode", "plantName", "departmentCode", "departmentName" },
                Required = new[] { "plantName", "departmentName" }
            },
            new MasterDataTable
            {
                Name = "machine-types", Label = "Machine Type",
                Fields = new[] { "name", "description", "plantDepartmentId" },
                Required = new[] { "name" }, Unique = new[] { "name" }
            },
            new MasterDataTable
            {
                Name = "main-sections", Label = "Main Section",
                Fields = new[] { "name", "description", "plantDepartmentId" },
                Required = new[] { "name" }, Unique = new[] { "name" }
            },
            new MasterDataTable
            {
                Name = "sub-sections", Label = "Sub Section",
                Fields = new[] { "name", "mainSectionId", "plantDepartmentId" },
                Required = new[] { "name", "mainSectionId" }
            },
            new MasterDataTable
            {
                Name = "material-codes", Label = "Material Code", DisplayField = "code",
                Fields = new[] { "code", "description", "plantDepartmentId" },
                Required = new[] { "code" }, Unique = new[] { "code" }
            },
            new MasterDataTable
            {
                Name = "parameters", Label = "Parameter",
                Fields = new[] { "name", "shortName", "unit", "description", "plantDepartmentId" },
                Required = new[] { "name" }, Unique = new[] { "name" }
            },
            new MasterDataTable
            {
                Name = "parameter-norms", Label = "Parameter Norm", DisplayField = "id",
                Fields = new[] { "parameterId", "plantDepartmentId", "minValue", "maxValue", "effectiveFrom" },
                Required = new[] { "parameterId", "minValue", "maxValue" },
                Numeric = new[] { "minValue", "maxValue" },
                Ranges = new[] { ("minValue", "maxValue") }
            },
            new MasterDataTable
            {
                Name = "parameter-qualified-values", Label = "Parameter Qualified Value", DisplayField = "id",
                Fields = new[] { "parameterId", "materialCodeId", "plantDepartmentId", "minValue", "targetValue", "maxValue" },
                Required = new[] { "parameterId", "materialCodeId", "minValue", "targetValue", "maxValue" },
                Numeric = new[] { "minValue", "targetValue", "maxValue" },
                Ranges = new[] { ("minValue", "targetValue"), ("targetValue", "maxValue") }
            },
            new MasterDataTable
            {
                Name = "tolerances", Label = "Tolerance",
                Fields = new[] { "name", "type", "plantDepartmentId" },
                Required = new[] { "name", "type" }, Unique = new[] { "name" }
            },
            new MasterDataTable
            {
                Name = "sections", Label = "Section", DisplayField = "shortName",
                Fields = new[] { "mainSectionId", "subSectionId", "machineTypeId", "parameterId", "shortName",
                                 "threshold", "equation", "sortNumber", "plantDepartmentId" },
                Required = new[] { "mainSectionId", "machineTypeId", "parameterId" },
                Numeric = new[] { "threshold", "sortNumber" }
            },
            new MasterDataTable
            {
                Name = "section-templates", Label = "Section Template", DisplayField = "shortName",
                Fields = new[] { "mainSectionId", "subSectionId", "machineTypeId", "parameterId", "toleranceId",
                                 "shortName", "threshold", "equation", "sortNumber", "plantDepartmentId" },
                Required = new[] { "mainSectionId", "machineTypeId", "parameterId" },
                Numeric = new[] { "threshold", "sortNumber" }
            },
            new MasterDataTable
            {
                Name = "shifts", Label = "Shift",
                Fields = new[] { "name", "startTime", "endTime", "plantDepartmentId" },
                Required = new[] { "name", "startTime", "endTime" }
            },
            new MasterDataTable
            {
                Name = "plant-dept-users", Label = "Plant Department User", DisplayField = "id",
                Fields = new[] { "userId", "plantDepartmentId" },
                Required = new[] { "userId", "plantDepartmentId" }
            },
        }.ToDictionary(t => t.Name);

        /// <summary>Audit fields set by the server, never accepted from the client.</summary>
        public static readonly string[] AuditFields = { "id", "createdBy", "createdByName", "createdAt", "modifiedBy", "modifiedByName", "modifiedAt" };
    }
}
