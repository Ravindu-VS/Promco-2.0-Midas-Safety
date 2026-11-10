using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [ApiController]
    [Authorize]
    public abstract class AppControllerBase : ControllerBase
    {
        protected readonly IDataStore Store;
        protected readonly ActivityService Activity;
        protected readonly NotificationService Notifications;

        protected AppControllerBase(IDataStore store, ActivityService activity, NotificationService notifications)
        {
            Store = store;
            Activity = activity;
            Notifications = notifications;
        }

        /// <summary>The signed-in user, loaded and validated during authentication.</summary>
        protected User CurrentUser =>
            HttpContext.Items[nameof(User)] as User
            ?? User.GetCurrentUser(Store)
            ?? throw new UnauthorizedAccessException();

        protected IActionResult Error(int status, string message) =>
            StatusCode(status, new { error = true, message });

        protected IActionResult BadRequestMessage(string message) => Error(400, message);

        protected IActionResult NotFoundMessage(string message) => Error(404, message);

        protected static string Clean(string? value) => (value ?? "").Trim();

        protected static bool IsValidDate(string? value) =>
            !string.IsNullOrWhiteSpace(value) && DateOnly.TryParseExact(value, "yyyy-MM-dd", out _);
    }
}
