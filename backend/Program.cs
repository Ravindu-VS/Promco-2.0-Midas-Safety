using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Promco.Models;
using Promco.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// ---------- Storage ----------
// "Json" (default): everything is saved to a JSON file, no database needed.
// "SqlServer": documents are stored in dbo.Documents (database/table created automatically).
var provider = builder.Configuration["Storage:Provider"] ?? "Json";
if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required for the SqlServer provider.");
    builder.Services.AddSingleton<IDataStore>(_ => new SqlServerDataStore(connectionString));
}
else
{
    var jsonPath = builder.Configuration["Storage:JsonFilePath"] ?? "App_Data/promco-data.json";
    if (!Path.IsPathRooted(jsonPath))
    {
        jsonPath = Path.Combine(builder.Environment.ContentRootPath, jsonPath);
    }
    builder.Services.AddSingleton<IDataStore>(_ => new JsonFileDataStore(jsonPath));
}
builder.Services.AddSingleton<ActivityService>();
builder.Services.AddSingleton<NotificationService>();

// ---------- CORS (only needed when the frontend is not using the dev proxy) ----------
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins(allowedOrigins).AllowAnyMethod().AllowAnyHeader());
});

// ---------- Swagger ----------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Promco 2.0 API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Paste the token returned by POST /api/auth/login",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>()
        }
    });
});

// ---------- JWT ----------
var jwtSecret = builder.Configuration["JwtSettings:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret.Length < 32)
{
    throw new InvalidOperationException("JwtSettings:Secret must be set and at least 32 characters long.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
        options.Events = new JwtBearerEvents
        {
            // Re-check the account on every request so deleted users are locked out and
            // role changes apply immediately (not only after the token expires).
            OnTokenValidated = context =>
            {
                var store = context.HttpContext.RequestServices.GetRequiredService<IDataStore>();
                var user = context.Principal?.GetCurrentUser(store);
                if (user == null)
                {
                    context.Fail("Account no longer exists.");
                    return Task.CompletedTask;
                }
                if (context.Principal?.Identity is ClaimsIdentity identity)
                {
                    foreach (var claim in identity.FindAll(ClaimTypes.Role).ToList())
                    {
                        identity.RemoveClaim(claim);
                    }
                    identity.AddClaim(new Claim(ClaimTypes.Role, user.Role));
                }
                context.HttpContext.Items[nameof(User)] = user;
                return Task.CompletedTask;
            }
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

// ---------- Initialise storage ----------
var store = app.Services.GetRequiredService<IDataStore>();
DataSeeder.Seed(store, app.Configuration, app.Logger);
app.Logger.LogInformation("Storage: {Provider}. Environment: {Environment}.", store.ProviderName, app.Environment.EnvironmentName);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
