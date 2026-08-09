namespace Student_Housing_Platform.Services.Distance
{
    public interface IDistanceCalculator
    {
        /// <summary>
        /// Calculates distance in kilometers between two geo coordinates using Haversine formula.
        /// </summary>
        double CalculateDistanceKm(double lat1, double lon1, double lat2, double lon2);
    }
}
