namespace Student_Housing_Platform.Services.Distance
{
    public class DistanceCalculator : IDistanceCalculator
    {
        private const double EarthRadiusKm = 6371.0;

        public double CalculateDistanceKm(double lat1, double lon1, double lat2, double lon2)
        {
            double ToRadians(double deg) => deg * (Math.PI / 180.0);

            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a = Math.Pow(Math.Sin(dLat / 2), 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Pow(Math.Sin(dLon / 2), 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return EarthRadiusKm * c;
        }
    }
}
