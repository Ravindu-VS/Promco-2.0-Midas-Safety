namespace Promco.Models
{
    public static class Roles
    {
        public const string Admin = "admin";
        public const string Manager = "manager";
        public const string Technician = "technician";
        public const string Operator = "operator";
        public const string User = "user";

        public static readonly string[] All = { Admin, Manager, Technician, Operator, User };
    }

    /// <summary>Stored user record. PasswordHash is never returned by the API.</summary>
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string Role { get; set; } = Roles.User;
        public string? ProfilePicture { get; set; }
        public string? Telephone { get; set; }
        public string? Address { get; set; }
        public string? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string Role { get; set; } = "";
        public string? ProfilePicture { get; set; }
        public string? Telephone { get; set; }
        public string? Address { get; set; }
        public string? DateOfBirth { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public static UserDto From(User u) => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role,
            ProfilePicture = u.ProfilePicture,
            Telephone = u.Telephone,
            Address = u.Address,
            DateOfBirth = u.DateOfBirth,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        };
    }

    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class CreateUserRequest
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public string? ProfilePicture { get; set; }
    }

    /// <summary>All fields optional: only the ones sent are changed.</summary>
    public class UpdateUserRequest
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }
        public string? ProfilePicture { get; set; }
        public string? Telephone { get; set; }
        public string? Address { get; set; }
        public string? DateOfBirth { get; set; }
        public string? Password { get; set; }
        public string? CurrentPassword { get; set; }
    }
}
