using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/users")]
    public class UsersController : AppControllerBase
    {
        private static readonly Regex EmailPattern = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        private const int MaxPictureLength = 2_800_000; // ~2 MB image as a data URL

        public UsersController(IDataStore store, ActivityService activity, NotificationService notifications)
            : base(store, activity, notifications) { }

        // GET: api/users  (admin, manager)
        [HttpGet]
        [Authorize(Roles = "admin,manager")]
        public IActionResult GetAll() =>
            Ok(new { users = Store.All<User>(Collections.Users).OrderBy(u => u.Id).Select(UserDto.From) });

        // GET: api/users/lookup  - id/name/role of every user, for dropdowns and display
        [HttpGet("lookup")]
        public IActionResult Lookup() =>
            Ok(Store.All<User>(Collections.Users).OrderBy(u => u.Username)
                .Select(u => new { u.Id, u.Username, u.Role }));

        // GET: api/users/5  (yourself, or admin/manager)
        [HttpGet("{id:int}")]
        public IActionResult GetById(int id)
        {
            var me = CurrentUser;
            if (me.Id != id && !me.IsManagerOrAdmin()) return Forbid();
            var user = Store.Find<User>(Collections.Users, id);
            return user == null ? NotFoundMessage("User not found") : Ok(UserDto.From(user));
        }

        // POST: api/users  (admin) - create an account that can sign in immediately
        [HttpPost]
        [Authorize(Roles = "admin")]
        public IActionResult Create([FromBody] CreateUserRequest request)
        {
            var username = Clean(request.Username);
            var email = Clean(request.Email).ToLowerInvariant();
            var role = Clean(request.Role).ToLowerInvariant();

            if (username.Length == 0 || email.Length == 0 || role.Length == 0 || string.IsNullOrEmpty(request.Password))
                return BadRequestMessage("Username, email, password and role are required");
            if (!EmailPattern.IsMatch(email)) return BadRequestMessage("Invalid email address");
            if (request.Password.Length < 6) return BadRequestMessage("Password must be at least 6 characters");
            if (!Roles.All.Contains(role)) return BadRequestMessage("Invalid role");
            if (request.ProfilePicture?.Length > MaxPictureLength) return BadRequestMessage("Profile picture is too large (max 2 MB)");

            var users = Store.All<User>(Collections.Users);
            if (users.Any(u => u.Email.ToLowerInvariant() == email)) return Error(409, "A user with this email already exists");
            if (users.Any(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)))
                return Error(409, "This username is already taken");

            var created = Store.Add(Collections.Users, new User
            {
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = role,
                ProfilePicture = string.IsNullOrWhiteSpace(request.ProfilePicture) ? null : request.ProfilePicture,
                CreatedAt = DateTime.UtcNow
            });

            var me = CurrentUser;
            Activity.Log(me, "created", "user", created.Id, $"Created user {created.Username} ({created.Role})");
            Notifications.Notify("account", "Welcome to Promco 2.0",
                $"Your {created.Role} account was created by {me.Username}.", "/profile", userIds: new[] { created.Id });

            return StatusCode(201, new { message = "User created successfully", user = UserDto.From(created) });
        }

        // PUT: api/users/5  - users edit their own profile; admins can edit anyone (incl. role/email)
        [HttpPut("{id:int}")]
        public IActionResult Update(int id, [FromBody] UpdateUserRequest request)
        {
            var me = CurrentUser;
            var isAdmin = me.Role == Roles.Admin;
            var isSelf = me.Id == id;
            if (!isSelf && !isAdmin) return Forbid();

            var user = Store.Find<User>(Collections.Users, id);
            if (user == null) return NotFoundMessage("User not found");

            var users = Store.All<User>(Collections.Users);
            var changes = new List<string>();

            if (request.Username != null)
            {
                var username = Clean(request.Username);
                if (username.Length == 0) return BadRequestMessage("Username cannot be empty");
                if (users.Any(u => u.Id != id && u.Username.Equals(username, StringComparison.OrdinalIgnoreCase)))
                    return Error(409, "This username is already taken");
                if (username != user.Username) changes.Add("username");
                user.Username = username;
            }

            if (request.Email != null)
            {
                if (!isAdmin) return Error(403, "Only an admin can change the email address");
                var email = Clean(request.Email).ToLowerInvariant();
                if (!EmailPattern.IsMatch(email)) return BadRequestMessage("Invalid email address");
                if (users.Any(u => u.Id != id && u.Email.ToLowerInvariant() == email))
                    return Error(409, "A user with this email already exists");
                if (email != user.Email) changes.Add("email");
                user.Email = email;
            }

            string? previousRole = null;
            if (request.Role != null)
            {
                var role = Clean(request.Role).ToLowerInvariant();
                if (role != user.Role)
                {
                    if (!isAdmin) return Error(403, "Only an admin can change roles");
                    if (!Roles.All.Contains(role)) return BadRequestMessage("Invalid role");
                    if (user.Role == Roles.Admin && users.Count(u => u.Role == Roles.Admin) == 1)
                        return BadRequestMessage("The last admin account cannot be demoted");
                    previousRole = user.Role;
                    user.Role = role;
                    changes.Add("role");
                }
            }

            if (request.ProfilePicture != null)
            {
                if (request.ProfilePicture.Length > MaxPictureLength) return BadRequestMessage("Profile picture is too large (max 2 MB)");
                if (request.ProfilePicture.Length > 0 && !request.ProfilePicture.StartsWith("data:image/"))
                    return BadRequestMessage("Profile picture must be an image");
                user.ProfilePicture = request.ProfilePicture.Length == 0 ? null : request.ProfilePicture;
                changes.Add("profile picture");
            }

            if (request.Telephone != null) { user.Telephone = Clean(request.Telephone); changes.Add("telephone"); }
            if (request.Address != null) { user.Address = Clean(request.Address); changes.Add("address"); }
            if (request.DateOfBirth != null)
            {
                var dob = Clean(request.DateOfBirth);
                if (dob.Length > 0 && !IsValidDate(dob)) return BadRequestMessage("Date of birth must be YYYY-MM-DD");
                user.DateOfBirth = dob.Length == 0 ? null : dob;
                changes.Add("date of birth");
            }

            if (!string.IsNullOrEmpty(request.Password))
            {
                if (request.Password.Length < 6) return BadRequestMessage("Password must be at least 6 characters");
                // Changing your own password requires the current one (admins resetting others do not).
                if (isSelf && (string.IsNullOrEmpty(request.CurrentPassword) ||
                               !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash)))
                    return BadRequestMessage("Current password is incorrect");
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                changes.Add("password");
            }

            user.UpdatedAt = DateTime.UtcNow;
            var saved = Store.Save(Collections.Users, id, user)!;

            if (changes.Count > 0)
            {
                var target = isSelf ? "own profile" : $"user {saved.Username}";
                Activity.Log(me, "updated", "user", id, $"Updated {target}: {string.Join(", ", changes.Distinct())}");
            }
            if (previousRole != null)
            {
                Notifications.Notify("account", "Your role was changed",
                    $"{me.Username} changed your role from {previousRole} to {saved.Role}.", "/profile", userIds: new[] { id });
            }
            if (!isSelf && changes.Contains("password"))
            {
                Notifications.Notify("account", "Your password was reset",
                    $"{me.Username} set a new password for your account.", "/profile", userIds: new[] { id });
            }

            return Ok(new { message = "User updated successfully", user = UserDto.From(saved) });
        }

        // DELETE: api/users/5  (admin, not yourself)
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var me = CurrentUser;
            if (me.Id == id) return BadRequestMessage("You cannot delete your own account");
            var user = Store.Find<User>(Collections.Users, id);
            if (user == null) return NotFoundMessage("User not found");

            var assignments = Store.List(Collections.MasterData("plant-dept-users")).Where(d => d.GetInt("userId") == id).ToList();
            foreach (var a in assignments) Store.Delete(Collections.MasterData("plant-dept-users"), a.GetInt("id")!.Value);

            Store.Delete(Collections.Users, id);
            Activity.Log(me, "deleted", "user", id, $"Deleted user {user.Username}");
            return Ok(new { message = "User deleted successfully" });
        }
    }
}
