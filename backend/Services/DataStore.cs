using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.Data.SqlClient;

namespace Promco.Services
{
    /// <summary>
    /// Minimal document store. Every record is a JSON object with an integer "id",
    /// grouped into named collections (users, machines, faults, master data tables, ...).
    /// Two implementations: a JSON file (default, zero setup) and SQL Server.
    /// </summary>
    public interface IDataStore
    {
        List<JsonObject> List(string collection);
        JsonObject? Get(string collection, int id);
        JsonObject Insert(string collection, JsonObject document);
        JsonObject? Replace(string collection, int id, JsonObject document);
        bool Delete(string collection, int id);
        string ProviderName { get; }
    }

    public static class DataStoreExtensions
    {
        public static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions(JsonSerializerDefaults.Web);

        public static JsonObject ToJsonObject<T>(T value) =>
            JsonSerializer.SerializeToNode(value, JsonOptions)!.AsObject();

        public static T FromJsonObject<T>(JsonObject obj) =>
            obj.Deserialize<T>(JsonOptions)!;

        public static JsonObject Clone(JsonObject obj) =>
            JsonNode.Parse(obj.ToJsonString())!.AsObject();

        public static List<T> All<T>(this IDataStore store, string collection) =>
            store.List(collection).Select(FromJsonObject<T>).ToList();

        public static T? Find<T>(this IDataStore store, string collection, int id) where T : class
        {
            var doc = store.Get(collection, id);
            return doc == null ? null : FromJsonObject<T>(doc);
        }

        public static T Add<T>(this IDataStore store, string collection, T entity) =>
            FromJsonObject<T>(store.Insert(collection, ToJsonObject(entity)));

        public static T? Save<T>(this IDataStore store, string collection, int id, T entity) where T : class
        {
            var doc = store.Replace(collection, id, ToJsonObject(entity));
            return doc == null ? null : FromJsonObject<T>(doc);
        }

        public static int? GetInt(this JsonObject obj, string property)
        {
            if (!obj.TryGetPropertyValue(property, out var node) || node == null) return null;
            if (node is JsonValue value)
            {
                if (value.TryGetValue<int>(out var i)) return i;
                if (value.TryGetValue<long>(out var l)) return (int)l;
                if (value.TryGetValue<double>(out var d)) return (int)d;
                if (value.TryGetValue<string>(out var s) && int.TryParse(s, out var parsed)) return parsed;
            }
            return null;
        }

        public static string? GetString(this JsonObject obj, string property)
        {
            if (!obj.TryGetPropertyValue(property, out var node) || node == null) return null;
            if (node is JsonValue value)
            {
                if (value.TryGetValue<string>(out var s)) return s;
                return value.ToJsonString();
            }
            return node.ToJsonString();
        }
    }

    /// <summary>Stores all collections in a single JSON file (written atomically on every change).</summary>
    public sealed class JsonFileDataStore : IDataStore
    {
        private readonly string _path;
        private readonly object _lock = new object();
        private readonly Dictionary<string, List<JsonObject>> _collections = new Dictionary<string, List<JsonObject>>();
        private readonly Dictionary<string, int> _nextIds = new Dictionary<string, int>();

        public string ProviderName => $"JSON file ({_path})";

        public JsonFileDataStore(string path)
        {
            _path = Path.GetFullPath(path);
            var dir = Path.GetDirectoryName(_path);
            if (!string.IsNullOrEmpty(dir)) Directory.CreateDirectory(dir);
            Load();
        }

        private void Load()
        {
            if (!File.Exists(_path)) return;
            var root = JsonNode.Parse(File.ReadAllText(_path))?.AsObject();
            if (root == null) return;

            if (root["collections"] is JsonObject collections)
            {
                foreach (var pair in collections)
                {
                    var list = new List<JsonObject>();
                    if (pair.Value is JsonArray array)
                    {
                        foreach (var item in array)
                        {
                            if (item is JsonObject obj) list.Add(DataStoreExtensions.Clone(obj));
                        }
                    }
                    _collections[pair.Key] = list;
                }
            }
            if (root["nextIds"] is JsonObject nextIds)
            {
                foreach (var pair in nextIds)
                {
                    _nextIds[pair.Key] = pair.Value?.GetValue<int>() ?? 1;
                }
            }
        }

        private void Persist()
        {
            var collections = new JsonObject();
            foreach (var pair in _collections)
            {
                var array = new JsonArray();
                foreach (var doc in pair.Value) array.Add(DataStoreExtensions.Clone(doc));
                collections[pair.Key] = array;
            }
            var nextIds = new JsonObject();
            foreach (var pair in _nextIds) nextIds[pair.Key] = pair.Value;

            var root = new JsonObject { ["collections"] = collections, ["nextIds"] = nextIds };
            var tmp = _path + ".tmp";
            File.WriteAllText(tmp, root.ToJsonString(new JsonSerializerOptions { WriteIndented = true }));
            File.Move(tmp, _path, true);
        }

        private List<JsonObject> Collection(string name)
        {
            if (!_collections.TryGetValue(name, out var list))
            {
                list = new List<JsonObject>();
                _collections[name] = list;
            }
            return list;
        }

        public List<JsonObject> List(string collection)
        {
            lock (_lock)
            {
                return Collection(collection).Select(DataStoreExtensions.Clone).ToList();
            }
        }

        public JsonObject? Get(string collection, int id)
        {
            lock (_lock)
            {
                var doc = Collection(collection).FirstOrDefault(d => d.GetInt("id") == id);
                return doc == null ? null : DataStoreExtensions.Clone(doc);
            }
        }

        public JsonObject Insert(string collection, JsonObject document)
        {
            lock (_lock)
            {
                var list = Collection(collection);
                if (!_nextIds.TryGetValue(collection, out var next))
                {
                    next = list.Count == 0 ? 1 : list.Max(d => d.GetInt("id") ?? 0) + 1;
                }
                var copy = DataStoreExtensions.Clone(document);
                copy["id"] = next;
                list.Add(copy);
                _nextIds[collection] = next + 1;
                Persist();
                return DataStoreExtensions.Clone(copy);
            }
        }

        public JsonObject? Replace(string collection, int id, JsonObject document)
        {
            lock (_lock)
            {
                var list = Collection(collection);
                var index = list.FindIndex(d => d.GetInt("id") == id);
                if (index < 0) return null;
                var copy = DataStoreExtensions.Clone(document);
                copy["id"] = id;
                list[index] = copy;
                Persist();
                return DataStoreExtensions.Clone(copy);
            }
        }

        public bool Delete(string collection, int id)
        {
            lock (_lock)
            {
                var removed = Collection(collection).RemoveAll(d => d.GetInt("id") == id) > 0;
                if (removed) Persist();
                return removed;
            }
        }
    }

    /// <summary>
    /// Stores documents in a single SQL Server table (dbo.Documents). The database and
    /// table are created automatically on startup.
    /// </summary>
    public sealed class SqlServerDataStore : IDataStore
    {
        private readonly string _connectionString;

        public string ProviderName => "SQL Server";

        public SqlServerDataStore(string connectionString)
        {
            _connectionString = connectionString;
            EnsureDatabase();
        }

        private void EnsureDatabase()
        {
            var builder = new SqlConnectionStringBuilder(_connectionString);
            var database = builder.InitialCatalog;
            if (!string.IsNullOrWhiteSpace(database))
            {
                var masterBuilder = new SqlConnectionStringBuilder(_connectionString) { InitialCatalog = "master" };
                using var master = new SqlConnection(masterBuilder.ConnectionString);
                master.Open();
                using var createDb = new SqlCommand("IF DB_ID(@db) IS NULL EXEC('CREATE DATABASE [' + @db + ']')", master);
                createDb.Parameters.AddWithValue("@db", database);
                createDb.ExecuteNonQuery();
            }

            using var connection = Open();
            const string createTable = @"
IF OBJECT_ID(N'dbo.Documents', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Documents (
        Collection NVARCHAR(100) NOT NULL,
        Id INT NOT NULL,
        Data NVARCHAR(MAX) NOT NULL,
        UpdatedAt DATETIME2 NOT NULL CONSTRAINT DF_Documents_UpdatedAt DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_Documents PRIMARY KEY (Collection, Id)
    );
END";
            using var command = new SqlCommand(createTable, connection);
            command.ExecuteNonQuery();
        }

        private SqlConnection Open()
        {
            var connection = new SqlConnection(_connectionString);
            connection.Open();
            return connection;
        }

        private static JsonObject Parse(string json) => JsonNode.Parse(json)!.AsObject();

        public List<JsonObject> List(string collection)
        {
            using var connection = Open();
            using var command = new SqlCommand("SELECT Data FROM dbo.Documents WHERE Collection = @c ORDER BY Id", connection);
            command.Parameters.AddWithValue("@c", collection);
            using var reader = command.ExecuteReader();
            var result = new List<JsonObject>();
            while (reader.Read()) result.Add(Parse(reader.GetString(0)));
            return result;
        }

        public JsonObject? Get(string collection, int id)
        {
            using var connection = Open();
            using var command = new SqlCommand("SELECT Data FROM dbo.Documents WHERE Collection = @c AND Id = @id", connection);
            command.Parameters.AddWithValue("@c", collection);
            command.Parameters.AddWithValue("@id", id);
            var data = command.ExecuteScalar() as string;
            return data == null ? null : Parse(data);
        }

        public JsonObject Insert(string collection, JsonObject document)
        {
            using var connection = Open();
            using var transaction = connection.BeginTransaction();
            using var nextId = new SqlCommand(
                "SELECT ISNULL(MAX(Id), 0) + 1 FROM dbo.Documents WITH (UPDLOCK, HOLDLOCK) WHERE Collection = @c",
                connection, transaction);
            nextId.Parameters.AddWithValue("@c", collection);
            var id = (int)nextId.ExecuteScalar()!;

            var copy = DataStoreExtensions.Clone(document);
            copy["id"] = id;

            using var insert = new SqlCommand(
                "INSERT INTO dbo.Documents (Collection, Id, Data) VALUES (@c, @id, @data)", connection, transaction);
            insert.Parameters.AddWithValue("@c", collection);
            insert.Parameters.AddWithValue("@id", id);
            insert.Parameters.AddWithValue("@data", copy.ToJsonString());
            insert.ExecuteNonQuery();
            transaction.Commit();
            return copy;
        }

        public JsonObject? Replace(string collection, int id, JsonObject document)
        {
            var copy = DataStoreExtensions.Clone(document);
            copy["id"] = id;
            using var connection = Open();
            using var command = new SqlCommand(
                "UPDATE dbo.Documents SET Data = @data, UpdatedAt = SYSUTCDATETIME() WHERE Collection = @c AND Id = @id",
                connection);
            command.Parameters.AddWithValue("@c", collection);
            command.Parameters.AddWithValue("@id", id);
            command.Parameters.AddWithValue("@data", copy.ToJsonString());
            return command.ExecuteNonQuery() == 0 ? null : copy;
        }

        public bool Delete(string collection, int id)
        {
            using var connection = Open();
            using var command = new SqlCommand("DELETE FROM dbo.Documents WHERE Collection = @c AND Id = @id", connection);
            command.Parameters.AddWithValue("@c", collection);
            command.Parameters.AddWithValue("@id", id);
            return command.ExecuteNonQuery() > 0;
        }
    }
}
