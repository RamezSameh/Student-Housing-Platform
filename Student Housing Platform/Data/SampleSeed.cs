using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Models;

namespace Student_Housing_Platform.Data
{
    public static class SampleSeed
    {
        public static async Task EnsureSampleDataAsync(IServiceProvider services, CancellationToken cancellationToken = default)
        {
            using var scope = services.CreateScope();
            var sp = scope.ServiceProvider;
            var context = sp.GetRequiredService<SHP_DbContext>();
            var userManager = sp.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = sp.GetRequiredService<RoleManager<IdentityRole>>();

            // create roles if missing
            string[] roles = new[] { "Admin", "Student", "Owner", "Customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // create sample owners and students
            var ownerEmail = "owner1@example.com";
            var owner = await userManager.FindByEmailAsync(ownerEmail);
            if (owner == null)
            {
                owner = new ApplicationUser { Email = ownerEmail, UserName = ownerEmail, FirstName = "Owner", LastName = "One", EmailConfirmed = true };
                await userManager.CreateAsync(owner, "Owner@123");
                await userManager.AddToRoleAsync(owner, "Owner");
            }

            var studentEmail = "student1@example.com";
            var student = await userManager.FindByEmailAsync(studentEmail);
            if (student == null)
            {
                student = new ApplicationUser { Email = studentEmail, UserName = studentEmail, FirstName = "Student", LastName = "One", EmailConfirmed = true };
                await userManager.CreateAsync(student, "Student@123");
                await userManager.AddToRoleAsync(student, "Student");
            }

            // sample amenities
            if (!await context.Amenities.AnyAsync(cancellationToken))
            {
                var ams = new List<Amenity>
                {
                    new Amenity { Name = "WiFi" },
                    new Amenity { Name = "Air Conditioning" },
                    new Amenity { Name = "Washing Machine" },
                    new Amenity { Name = "Kitchen" },
                    new Amenity { Name = "Furniture" }
                };
                await context.Amenities.AddRangeAsync(ams, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }
            // sample housing types
            if (!await context.HousingTypes.AnyAsync(cancellationToken))
            {
                var housingTypes = new List<HousingType>
    {
        new HousingType
        {
            HousingTypeName = "Apartment",
            Description = "Private apartment",
            Capacity = 4,
            PricePerMonth = 2500
        },
        new HousingType
        {
            HousingTypeName = "Room",
            Description = "Private student room",
            Capacity = 1,
            PricePerMonth = 1800
        },
        new HousingType
        {
            HousingTypeName = "Shared Housing",
            Description = "Shared student accommodation",
            Capacity = 2,
            PricePerMonth = 1200
        }
    };

                await context.HousingTypes.AddRangeAsync(
                    housingTypes,
                    cancellationToken);

                await context.SaveChangesAsync(cancellationToken);
            }
            var apartmentType = await context.HousingTypes
    .FirstAsync(
        x => x.HousingTypeName == "Apartment",
        cancellationToken);

            var roomType = await context.HousingTypes
                .FirstAsync(
                    x => x.HousingTypeName == "Room",
                    cancellationToken);
            // sample housings by owner
            if (!await context.Housings.AnyAsync(cancellationToken))
            {
                var h1 = new Housing
                {
                    Title = "Cozy Student House",
                    Description = "Near university, furnished",
                    Address = "Street 1",
                    City = "Cairo",
                    Latitude = 30.0365,
                    Longitude = 31.2100,
                    Price = 2500,
                    IsFurnished = true,
                    IsAvailable = true,
                    OwnerId = owner.Id,
                    CreatedAt = DateTime.UtcNow,
                    HousingTypeId = apartmentType.HousingTypeId

                };
                var h2 = new Housing
                {
                    Title = "Budget Room",
                    Description = "Affordable",
                    Address = "Street 2",
                    City = "Giza",
                    Latitude = 30.0240,
                    Longitude = 31.2000,
                    Price = 1800,
                    IsFurnished = false,
                    IsAvailable = true,
                    OwnerId = owner.Id,
                    CreatedAt = DateTime.UtcNow,
                    HousingTypeId = roomType.HousingTypeId,
                };
                await context.Housings.AddRangeAsync(new[] { h1, h2 }, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                // rooms
                var room1 = new HousingRoom { HousingId = h1.HousingId, RoomType = "Single", Capacity = 1, AvailableBeds = 1, Price = 2500 };
                var room2 = new HousingRoom { HousingId = h2.HousingId, RoomType = "Double", Capacity = 2, AvailableBeds = 2, Price = 900 };
                await context.HousingRooms.AddRangeAsync(new[] { room1, room2 }, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                // connect amenities to housing
                var wifi = await context.Amenities.FirstOrDefaultAsync(a => a.Name == "WiFi", cancellationToken);
                if (wifi != null)
                {
                    await context.HousingAmenities.AddAsync(new HousingAmenity { HousingId = h1.HousingId, AmenityId = wifi.AmenityId }, cancellationToken);
                    await context.HousingAmenities.AddAsync(new HousingAmenity { HousingId = h2.HousingId, AmenityId = wifi.AmenityId }, cancellationToken);
                }
                await context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
