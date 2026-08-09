using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Models;

namespace Student_Housing_Platform.Data
{
    public static class SeedData
    {
        public static async Task EnsureSeedDataAsync(IServiceProvider services, CancellationToken cancellationToken = default)
        {
            using var scope = services.CreateScope();
            var ctx = scope.ServiceProvider.GetRequiredService<SHP_DbContext>();

            if (await ctx.Universities.AnyAsync(cancellationToken))
                return;

            var universities = new List<University>
            {
                new University { Name = "Cairo University", City = "Giza", Address = "Giza, Egypt", Latitude = 30.0360, Longitude = 31.2098, Description = "Cairo University", CreatedAt = DateTime.UtcNow },
                new University { Name = "Ain Shams University", City = "Cairo", Address = "El-Khalifa El-Maamoun St, Cairo", Latitude = 30.0626, Longitude = 31.2497, Description = "Ain Shams University", CreatedAt = DateTime.UtcNow },
                new University { Name = "Helwan University", City = "Cairo", Address = "Helwan, Cairo", Latitude = 29.8614, Longitude = 31.2910, Description = "Helwan University", CreatedAt = DateTime.UtcNow },
                new University { Name = "October 6 University", City = "6th of October", Address = "6th of October City", Latitude = 29.9711, Longitude = 30.9266, Description = "October 6 University", CreatedAt = DateTime.UtcNow },
                new University { Name = "Nile University", City = "Giza", Address = "Sheikh Zayed, Giza", Latitude = 30.0241, Longitude = 31.2010, Description = "Nile University", CreatedAt = DateTime.UtcNow },
                new University { Name = "German University in Cairo", City = "New Cairo", Address = "New Cairo", Latitude = 30.0207, Longitude = 31.5046, Description = "German University in Cairo", CreatedAt = DateTime.UtcNow }
            };

            await ctx.Universities.AddRangeAsync(universities, cancellationToken);
            await ctx.SaveChangesAsync(cancellationToken);
        }
    }
}
