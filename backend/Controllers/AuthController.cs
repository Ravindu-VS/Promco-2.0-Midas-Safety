using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Promco.Models;
using Promco.Services;

namespace Promco.Controllers
{
    [Route("api/auth")]
    public class AuthController : AppControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IDataStore store, ActivityService activity, NotificationService notifications,
            IConfiguration configuration) : base(store, activity, notifications)
        {
            _configuration = configuration;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var email = Clean(request.Email).ToLowerInvariant();
            if (email.Length == 0 || string.IsNullOrEmpty(request.Password))
            {
                return BadRequestMessage("Email and password are required");
            }

            var user = Store.All<User>(Collections.Users).FirstOrDefault(u => u.Email.ToLowerInvariant() == email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Error(401, "Invalid email or password");
            }

            Activity.Log(user, "login", "session", null, $"{user.Username} signed in");
            return Ok(new { message = "Login successful", user = UserDto.From(user), token = CreateToken(user) });
        }

        // GET: api/auth/me
        [HttpGet("me")]
        public IActionResult Me() => Ok(UserDto.From(CurrentUser));

        private string CreateToken(User user)
        {
            var secret = _configuration["JwtSettings:Secret"]!;
            var hours = _configuration.GetValue<int?>("JwtSettings:ExpiryHours") ?? 8;
            var descriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddHours(hours),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)), SecurityAlgorithms.HmacSha256Signature)
            };
            var handler = new JwtSecurityTokenHandler();
            return handler.WriteToken(handler.CreateToken(descriptor));
        }
    }
}
