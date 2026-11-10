using System.Globalization;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/masterdata")]
    public class MasterDataController : AppControllerBase
    {
        public MasterDataController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/masterdata  - the tables and how many records each holds
        [HttpGet]
        public IActionResult Tables() =>
            Ok(MasterDataSchema.Tables.Values.Select(t => new
            {
                t.Name,
                t.Label,
                count = Store.List(Collections.MasterData(t.Name)).Count
            }));

        // GET: api/masterdata/machine-types
        [HttpGet("{table}")]
        public IActionResult List(string table)
        {
            if (!MasterDataSchema.Tables.ContainsKey(table)) return NotFoundMessage($"Unknown table '{table}'");
            return Ok(Store.List(Collections.MasterData(table)));
        }

        // POST: api/masterdata/machine-types
        [HttpPost("{table}")]
        [Authorize(Roles = "admin,manager")]
        public IActionResult Create(string table, [FromBody] JsonElement body)
        {
            if (!MasterDataSchema.Tables.TryGetValue(table, out var def)) return NotFoundMessage($"Unknown table '{table}'");
            var (record, error) = Normalize(def, body, null);
            if (error != null) return BadRequestMessage(error);

            var me = CurrentUser;
            record!["createdBy"] = me.Id;
            record["createdByName"] = me.Username;
            record["createdAt"] = DateTime.UtcNow;

            var created = Store.Insert(Collections.MasterData(table), record);
            var id = created.GetInt("id")!.Value;
            Activity.Log(me, "created", table, id, $"Added {def.Label} {Describe(def, created)}");
            return StatusCode(201, created);
        }

        // PUT: api/masterdata/machine-types/3
        [HttpPut("{table}/{id:int}")]
        [Authorize(Roles = "admin,manager")]
        public IActionResult Update(string table, int id, [FromBody] JsonElement body)
        {
            if (!MasterDataSchema.Tables.TryGetValue(table, out var def)) return NotFoundMessage($"Unknown table '{table}'");
            var existing = Store.Get(Collections.MasterData(table), id);
            if (existing == null) return NotFoundMessage($"{def.Label} not found");

            var (record, error) = Normalize(def, body, id);
            if (error != null) return BadRequestMessage(error);

            var me = CurrentUser;
            foreach (var audit in new[] { "createdBy", "createdByName", "createdAt" })
            {
                if (existing[audit] != null) record![audit] = existing[audit]!.DeepCloneNode();
            }
            record!["modifiedBy"] = me.Id;
            record["modifiedByName"] = me.Username;
            record["modifiedAt"] = DateTime.UtcNow;

            var saved = Store.Replace(Collections.MasterData(table), id, record)!;
            Activity.Log(me, "updated", table, id, $"Updated {def.Label} {Describe(def, saved)}");
            return Ok(saved);
        }

        // DELETE: api/masterdata/machine-types/3  - refused while other records still reference it
        [HttpDelete("{table}/{id:int}")]
        [Authorize(Roles = "admin,manager")]
        public IActionResult Delete(string table, int id)
        {
            if (!MasterDataSchema.Tables.TryGetValue(table, out var def)) return NotFoundMessage($"Unknown table '{table}'");
            var existing = Store.Get(Collections.MasterData(table), id);
            if (existing == null) return NotFoundMessage($"{def.Label} not found");

            var usages = FindUsages(Collections.MasterData(table), id);
            if (usages.Count > 0)
            {
                return Error(409, $"Cannot delete: still used by {string.Join(", ", usages)}. Remove or change those records first.");
            }

            Store.Delete(Collections.MasterData(table), id);
            Activity.Log(CurrentUser, "deleted", table, id, $"Deleted {def.Label} {Describe(def, existing)}");
            return Ok(new { message = $"{def.Label} deleted" });
        }

        private (JsonObject? Record, string? Error) Normalize(MasterDataTable def, JsonElement body, int? id)
        {
            if (body.ValueKind != JsonValueKind.Object) return (null, "Request body must be a JSON object");
            var input = JsonNode.Parse(body.GetRawText())!.AsObject();
            var record = new JsonObject();

            foreach (var field in def.Fields)
            {
                if (!input.TryGetPropertyValue(field, out var node) || node == null) continue;
                var raw = node is JsonValue v && v.TryGetValue<string>(out var s) ? s.Trim() : node.ToJsonString();
                if (raw.Length == 0) continue;

                if (MasterDataSchema.References.TryGetValue(field, out var target))
                {
                    if (!int.TryParse(raw, out var refId)) return (null, $"{field} must be a record id");
                    if (Store.Get(target, refId) == null) return (null, $"Selected {Label(field)} does not exist");
                    record[field] = refId;
                }
                else if (def.Numeric.Contains(field))
                {
                    if (!double.TryParse(raw, NumberStyles.Float, CultureInfo.InvariantCulture, out var number))
                        return (null, $"{Label(field)} must be a number");
                    record[field] = number;
                }
                else
                {
                    if (raw.Length > 500) return (null, $"{Label(field)} is too long");
                    record[field] = raw;
                }
            }

            foreach (var required in def.Required)
            {
                if (record[required] == null) return (null, $"{Label(required)} is required");
            }

            foreach (var (min, max) in def.Ranges)
            {
                var a = record[min]?.GetValue<double>();
                var b = record[max]?.GetValue<double>();
                if (a != null && b != null && a > b) return (null, $"{Label(min)} must not be greater than {Label(max)}");
            }

            var others = Store.List(Collections.MasterData(def.Name)).Where(r => r.GetInt("id") != id).ToList();
            foreach (var unique in def.Unique)
            {
                var value = record.GetString(unique);
                if (value != null && others.Any(o => string.Equals(o.GetString(unique), value, StringComparison.OrdinalIgnoreCase)))
                    return (null, $"A {def.Label.ToLowerInvariant()} with {Label(unique)} '{value}' already exists");
            }

            return (record, null);
        }

        /// <summary>Lists which tables still reference the given record.</summary>
        private List<string> FindUsages(string collection, int id)
        {
            var usages = new List<string>();
            var fields = MasterDataSchema.References.Where(r => r.Value == collection).Select(r => r.Key).ToList();
            if (fields.Count == 0) return usages;

            foreach (var other in MasterDataSchema.Tables.Values)
            {
                var count = Store.List(Collections.MasterData(other.Name))
                    .Count(r => fields.Any(f => other.Fields.Contains(f) && r.GetInt(f) == id));
                if (count > 0) usages.Add($"{count} {other.Label.ToLowerInvariant()} record(s)");
            }

            var machines = Store.All<Machine>(Collections.Machines).Count(m =>
                (fields.Contains("machineTypeId") && m.MachineTypeId == id) ||
                (fields.Contains("mainSectionId") && m.MainSectionId == id) ||
                (fields.Contains("subSectionId") && m.SubSectionId == id) ||
                (fields.Contains("plantDepartmentId") && m.PlantDepartmentId == id));
            if (machines > 0) usages.Add($"{machines} machine(s)");
            return usages;
        }

        private static string Describe(MasterDataTable def, JsonObject record)
        {
            var display = def.DisplayField == "id" ? null : record.GetString(def.DisplayField);
            return display != null ? $"'{display}' (#{record.GetInt("id")})" : $"#{record.GetInt("id")}";
        }

        private static string Label(string field)
        {
            var name = field.EndsWith("Id") ? field[..^2] : field;
            var chars = new List<char>();
            foreach (var c in name)
            {
                if (char.IsUpper(c) && chars.Count > 0) chars.Add(' ');
                chars.Add(chars.Count == 0 ? char.ToUpperInvariant(c) : char.ToLowerInvariant(c));
            }
            return new string(chars.ToArray());
        }
    }

    internal static class JsonNodeCloneExtensions
    {
        // JsonNode.DeepClone() only exists from .NET 8; this works on .NET 7.
        public static JsonNode DeepCloneNode(this JsonNode node) => JsonNode.Parse(node.ToJsonString())!;
    }
}
