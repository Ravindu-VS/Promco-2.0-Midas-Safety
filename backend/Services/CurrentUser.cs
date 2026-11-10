using System.Security.Claims;
using Promco.Models;

namespace Promco.Services
{
    public static class CurrentUserExtensions
    {
        public static int? GetUserId(this ClaimsPrincipal principal)
        {
            var value = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(value, out var id) ? id : null;
        }

        /// <summary>Loads the signed-in user from the store (null if the account no longer exists).</summary>
        public static User? GetCurrentUser(this ClaimsPrincipal principal, IDataStore store)
        {
            var id = principal.GetUserId();
            return id == null ? null : store.Find<User>(Collections.Users, id.Value);
        }

        public static bool IsManagerOrAdmin(this User user) =>
            user.Role == Roles.Admin || user.Role == Roles.Manager;
    }
}
