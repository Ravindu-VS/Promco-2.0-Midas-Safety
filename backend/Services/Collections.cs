namespace Promco.Services
{
    public static class Collections
    {
        public const string Users = "users";
        public const string Machines = "machines";
        public const string Faults = "faults";
        public const string Maintenance = "maintenance";
        public const string ParameterValues = "parameter-values";
        public const string Notifications = "notifications";
        public const string Activity = "activity";
        public const string Messages = "messages";

        /// <summary>Master data tables live in collections named "md:{table}".</summary>
        public static string MasterData(string table) => "md:" + table;
    }
}
