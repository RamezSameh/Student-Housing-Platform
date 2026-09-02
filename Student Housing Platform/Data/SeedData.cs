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
                new University { Name = "Cairo University", City = "Giza", Address = "Giza, Egypt", Latitude = 30.0360, Longitude = 31.2098, Description = "One of Egypt's largest and oldest public universities.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Ain Shams University", City = "Cairo", Address = "El-Khalifa El-Maamoun St, Cairo", Latitude = 30.0626, Longitude = 31.2497, Description = "A major public university in Abbassia, Cairo.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Helwan University", City = "Cairo", Address = "Helwan, Cairo", Latitude = 29.8614, Longitude = 31.2910, Description = "Public university based in Helwan, south Cairo.", CreatedAt = DateTime.UtcNow },
                new University { Name = "October 6 University", City = "6th of October", Address = "6th of October City", Latitude = 29.9711, Longitude = 30.9266, Description = "Private university in 6th of October City.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Nile University", City = "Giza", Address = "Sheikh Zayed, Giza", Latitude = 30.0241, Longitude = 31.2010, Description = "Private research university in Sheikh Zayed.", CreatedAt = DateTime.UtcNow },
                new University { Name = "German University in Cairo", City = "New Cairo", Address = "New Cairo", Latitude = 30.0207, Longitude = 31.5046, Description = "Private university offering German-accredited programs.", CreatedAt = DateTime.UtcNow },
                new University { Name = "American University in Cairo", City = "New Cairo", Address = "AUC Avenue, New Cairo", Latitude = 30.0189, Longitude = 31.4998, Description = "Private university offering American-accredited liberal arts programs.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Alexandria University", City = "Alexandria", Address = "El-Shatby, Alexandria", Latitude = 31.2089, Longitude = 29.9092, Description = "Major public university on the Mediterranean coast.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Mansoura University", City = "Mansoura", Address = "Elgomhouria St, Mansoura", Latitude = 31.0409, Longitude = 31.3785, Description = "Public university serving the Nile Delta region.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Zagazig University", City = "Zagazig", Address = "Zagazig, Sharqia", Latitude = 30.5877, Longitude = 31.5019, Description = "Public university in the Sharqia governorate.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Tanta University", City = "Tanta", Address = "El-Giesh St, Tanta", Latitude = 30.7865, Longitude = 30.9976, Description = "Public university in the Gharbia governorate.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Assiut University", City = "Assiut", Address = "Assiut, Upper Egypt", Latitude = 27.1809, Longitude = 31.1837, Description = "The largest public university in Upper Egypt.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Suez Canal University", City = "Ismailia", Address = "Ismailia, Egypt", Latitude = 30.6043, Longitude = 32.2723, Description = "Public university serving the Suez Canal region.", CreatedAt = DateTime.UtcNow },
                new University { Name = "Beni-Suef University", City = "Beni Suef", Address = "Beni Suef, Egypt", Latitude = 29.0661, Longitude = 31.0994, Description = "Public university in Upper Egypt.", CreatedAt = DateTime.UtcNow },
            };

            await ctx.Universities.AddRangeAsync(universities, cancellationToken);
            await ctx.SaveChangesAsync(cancellationToken);
        }
    }
}
