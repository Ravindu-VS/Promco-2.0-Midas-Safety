using System.Security.Cryptography;
using System.Text.Json.Nodes;
using Promco.Models;

namespace Promco.Services
{
    /// <summary>
    /// Creates the initial accounts on an empty store and, only when explicitly enabled
    /// with "Seed:SampleData": true, a small set of clearly-labelled sample master data.
    /// </summary>
    public static class DataSeeder
    {
        private const string MetaCollection = "meta";

        public static void Seed(IDataStore store, IConfiguration configuration, ILogger logger)
        {
            SeedUsers(store, configuration, logger);

            if (configuration.GetValue<bool>("Seed:SampleData"))
            {
                SeedSampleMasterData(store, logger);
            }
        }

        private static void SeedUsers(IDataStore store, IConfiguration configuration, ILogger logger)
        {
            if (store.List(Collections.Users).Count > 0) return;

            if (configuration.GetValue<bool>("Seed:DemoAccounts"))
            {
                var accounts = new (string Username, string Email, string Password, string Role)[]
                {
                    ("john_doe", "admin@example.com", "adminpass", Roles.Admin),
                    ("jane_smith", "manager@example.com", "managerpass", Roles.Manager),
                    ("bob_johnson", "technician@example.com", "techpass", Roles.Technician),
                    ("michael_jordan", "operator@example.com", "operatorpass", Roles.Operator),
                    ("emily_clark", "user@example.com", "userpass", Roles.User),
                };
                foreach (var a in accounts)
                {
                    store.Add(Collections.Users, NewUser(a.Username, a.Email, a.Password, a.Role));
                }
                logger.LogInformation("Seeded {Count} development accounts (see README for the passwords).", accounts.Length);
                return;
            }

            // Production-style first run: one admin account with a random password.
            var email = configuration["Seed:AdminEmail"] ?? "admin@example.com";
            var password = configuration["Seed:AdminPassword"];
            var generated = string.IsNullOrWhiteSpace(password);
            if (generated)
            {
                password = Convert.ToBase64String(RandomNumberGenerator.GetBytes(12));
            }
            store.Add(Collections.Users, NewUser("admin", email, password!, Roles.Admin));
            logger.LogWarning(generated
                ? "Created the first admin account {Email} with generated password: {Password} - sign in and change it."
                : "Created the first admin account {Email} using Seed:AdminPassword.", email, generated ? password : "");
        }

        private static User NewUser(string username, string email, string password, string role) => new User
        {
            Username = username,
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        private static void SeedSampleMasterData(IDataStore store, ILogger logger)
        {
            if (store.List(MetaCollection).Any(m => m.GetString("key") == "sampleDataSeeded")) return;

            var admin = store.All<User>(Collections.Users).FirstOrDefault(u => u.Role == Roles.Admin);
            var adminId = admin?.Id ?? 0;
            var adminName = admin?.Username ?? "system";

            int Add(string table, JsonObject fields)
            {
                fields["createdBy"] = adminId;
                fields["createdByName"] = adminName;
                fields["createdAt"] = DateTime.UtcNow;
                return store.Insert(Collections.MasterData(table), fields).GetInt("id")!.Value;
            }

            var knitting = Add("plant-departments", new JsonObject { ["plantCode"] = "P01", ["plantName"] = "Sample Plant", ["departmentCode"] = "KN", ["departmentName"] = "Knitting" });
            var dipping = Add("plant-departments", new JsonObject { ["plantCode"] = "P01", ["plantName"] = "Sample Plant", ["departmentCode"] = "DP", ["departmentName"] = "Dipping" });

            var knitType = Add("machine-types", new JsonObject { ["name"] = "Knitting Machine", ["plantDepartmentId"] = knitting });
            var dipType = Add("machine-types", new JsonObject { ["name"] = "Dipping Line", ["plantDepartmentId"] = dipping });

            var knitSection = Add("main-sections", new JsonObject { ["name"] = "Knitting", ["plantDepartmentId"] = knitting });
            var dipSection = Add("main-sections", new JsonObject { ["name"] = "Dipping", ["plantDepartmentId"] = dipping });
            Add("sub-sections", new JsonObject { ["name"] = "Coating", ["mainSectionId"] = dipSection, ["plantDepartmentId"] = dipping });

            Add("parameters", new JsonObject { ["name"] = "Oven Temperature", ["shortName"] = "OVT", ["unit"] = "°C", ["plantDepartmentId"] = dipping });
            Add("shifts", new JsonObject { ["name"] = "Shift A", ["startTime"] = "06:00", ["endTime"] = "14:00", ["plantDepartmentId"] = knitting });

            store.Insert(MetaCollection, new JsonObject { ["key"] = "sampleDataSeeded", ["at"] = DateTime.UtcNow });
            logger.LogInformation("Seeded sample master data (Seed:SampleData = true). Types {Knit}/{Dip}, sections {KS}/{DS}.",
                knitType, dipType, knitSection, dipSection);
        }
    }
}
