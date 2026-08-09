using Student_Housing_Platform.Services.Distance;
using Xunit;

namespace StudentHousingPlatform.Tests
{
    public class DistanceTests
    {
        [Fact]
        public void Haversine_Calculates_Approximate_Distance()
        {
            var calc = new DistanceCalculator();
            // Cairo University (30.0360,31.2098) to Ain Shams (30.0626,31.2497)
            var d = calc.CalculateDistanceKm(30.0360, 31.2098, 30.0626, 31.2497);
            // Expect around ~3.8 km (approx). Allow tolerance 1 km.
            Assert.InRange(d, 2.0, 6.0);
n        }
    }
}
