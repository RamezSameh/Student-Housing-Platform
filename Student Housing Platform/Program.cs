using Student_Housing_Platform.OptionsPattern.Settings;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using Student_Housing_Platform.RepositoryPattern.Repositories;
using Student_Housing_Platform.Services.CloudinaryService;
using Student_Housing_Platform.Services.TokenService;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Services.Distance;
using Student_Housing_Platform.Extensions;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// telling the app to use the ApplicationUser and IdentityRole for identity management
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<SHP_DbContext>().AddDefaultTokenProviders();

// add DbContext service to the application (enable NetTopologySuite for spatial)
builder.Services.AddDbContext<SHP_DbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"), sql => sql.UseNetTopologySuite()));

//bind the cloudinary settings from appsettings.json
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection(CloudinarySettings.SectionName));

// bind the admin settings from appsettings.json
builder.Services.Configure<AdminSettings>(builder.Configuration.GetSection(AdminSettings.SectionName));

// bind the JWT settings from appsettings.json
builder.Services.Configure<JWTSettings>(builder.Configuration.GetSection(JWTSettings.SectionName));
var jwtSettings = new JWTSettings();
builder.Configuration.GetSection(JWTSettings.SectionName).Bind(jwtSettings);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = jwtSettings.ValidAudience,
        ValidIssuer = jwtSettings.ValidIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
        RoleClaimType = ClaimTypes.Role,
        NameClaimType = ClaimTypes.Name
    };
});

builder.Services.AddControllers();
// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Student_Housing_Platform.Validators.CreateHousingDtoValidator>();
builder.Services.AddEndpointsApiExplorer();
// SignalR
builder.Services.AddSignalR();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Please enter token (JWT) with Bearer prefix: Bearer {token}",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// DI registrations
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IRoomTypeRepository, RoomTypeRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<ICloudinaryService, CloudinaryService>();
builder.Services.AddScoped<IFavoriteRepository, FavoriteRepository>();
// Housing reviews repository
builder.Services.AddScoped<IHousingReviewRepository, HousingReviewRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

// University repository and distance service
builder.Services.AddScoped<IUniversityRepository, UniversityRepository>();
builder.Services.AddSingleton<IDistanceCalculator, DistanceCalculator>();
// Housing repository
builder.Services.AddScoped<IHousingRepository, HousingRepository>();
// Recommendation service
builder.Services.AddScoped<Student_Housing_Platform.Services.Recommendation.IRecommendationService, Student_Housing_Platform.Services.Recommendation.RecommendationService>();
// Admin service
builder.Services.AddScoped<Student_Housing_Platform.Services.Admin.IAdminService, Student_Housing_Platform.Services.Admin.AdminService>();
// Message repository (for SignalR persistence)
builder.Services.AddScoped<Student_Housing_Platform.RepositoryPattern.Interfaces.IMessageRepository, Student_Housing_Platform.RepositoryPattern.Repositories.MessageRepository>();
builder.Services.AddMemoryCache();

builder.Services.AddAuthorization();

var app = builder.Build();

// Use global exception handling middleware
app.UseGlobalExceptionHandling();
// Rate limiting
app.UseMiddleware<Student_Housing_Platform.Middleware.RateLimitingMiddleware>();

// seeding default admin user and roles
using (var scope = app.Services.CreateScope())
{
    var Services = scope.ServiceProvider;
    var userManager = Services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = Services.GetRequiredService<RoleManager<IdentityRole>>();
    var adminSettings = Services.GetRequiredService<IOptions<AdminSettings>>().Value;
    var logger = Services.GetRequiredService<ILogger<Program>>();

    //create roles (Admin, Student, Owner, Customer)
    string[] roles = { "Admin", "Student", "Owner", "Customer" };
    foreach (var role in roles)
    {
        var roleExist = await roleManager.RoleExistsAsync(role);
        if (!roleExist)
        {
            var result = await roleManager.CreateAsync(new IdentityRole(role));
            if (result.Succeeded)
            {
                logger.LogInformation($"Role '{role}' created successfully.");
            }
            else
            {
                logger.LogError($"Error creating role '{role}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }
    }

    //create default admin credentials
    if (!string.IsNullOrEmpty(adminSettings.Email) && !string.IsNullOrEmpty(adminSettings.Password))
    {
        var adminEmail = adminSettings.Email;
        var adminPassword = adminSettings.Password;
        var adminUser = await userManager.FindByEmailAsync(adminSettings.Email);
        if (adminUser == null)
        {
            var newAdminUser = new ApplicationUser
            {
                UserName = adminSettings.Email,
                Email = adminSettings.Email,
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "test"
            };
            var createAdminResult = await userManager.CreateAsync(newAdminUser, adminSettings.Password);
            if (createAdminResult.Succeeded)
            {
                await userManager.AddToRoleAsync(newAdminUser, "Admin");
                logger.LogInformation("Default admin user created successfully.");
            }
            else
            {
                logger.LogError($"Error creating default admin user: {string.Join(", ", createAdminResult.Errors.Select(e => e.Description))}");
            }
        }
        else
        {
            if (!await userManager.IsInRoleAsync(adminUser, "Admin"))
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
                logger.LogInformation("Existing user assigned to Admin role.", adminEmail);
            }
        }
    }

    // Seed universities (will skip if data exists)
    await SeedData.EnsureSeedDataAsync(app.Services);
    // Seed sample users, housings, amenities
    await Student_Housing_Platform.Data.SampleSeed.EnsureSampleDataAsync(app.Services);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
// Map SignalR hubs
app.MapHub<Student_Housing_Platform.Hubs.ChatHub>("/hubs/chat");
app.MapControllers();
app.MapGet("/", () => "API is running...");
app.Run();
