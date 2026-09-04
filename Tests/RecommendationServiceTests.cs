using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Services.Distance;
using Student_Housing_Platform.Services.Recommendation;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.Models.Enums;
using Xunit;

namespace StudentHousingPlatform.Tests
{
    public class RecommendationServiceTests
    {
        [Fact]
        public async Task RecommendAsync_Returns_HigherScore_For_Closer_And_Cheaper()
        {
            var options = new DbContextOptionsBuilder<SHP_DbContext>()
                .UseInMemoryDatabase(databaseName: "rec_test_db")
                .Options;

            using var context = new SHP_DbContext(options);
            // seed university
            var uni = new University { UniversityId = 1, Name = "U1", Latitude = 30.0360, Longitude = 31.2098, City = "Cairo", Address = "addr" };
            context.Universities.Add(uni);

            // seed two housings: one close & cheap, one far & expensive
            var h1 = new Housing { HousingId = 1, Title = "CloseCheap", Address = "addr1", City = "Cairo", Latitude = 30.0370, Longitude = 31.2100, Price = 2000, IsAvailable = true, OwnerId = "owner1" };
            var h2 = new Housing { HousingId = 2, Title = "FarExpensive", Address = "addr2", City = "Cairo", Latitude = 31.0000, Longitude = 32.0000, Price = 5000, IsAvailable = true, OwnerId = "owner2" };
            context.Housings.AddRange(h1, h2);

            // reviews: h1 has rating 5, h2 has rating 3
            context.HousingReviews.Add(new HousingReview { HousingReviewId = 1, HousingId = 1, Rating = 5, UserId = "u1" });
            context.HousingReviews.Add(new HousingReview { HousingReviewId = 2, HousingId = 2, Rating = 3, UserId = "u2" });
            await context.SaveChangesAsync();

            var distanceCalculator = new DistanceCalculator();
            var service = new RecommendationService(context, distanceCalculator);

            var result = await service.RecommendAsync(universityId: 1, maxBudget: 6000, maxDistance: 1000, page: 1, pageSize: 10);

            Assert.NotNull(result);
            Assert.True(result.Items.Any());
            // best match should be CloseCheap first
            Assert.Equal(1, result.Items.First().HousingId);
        }
    }
}
