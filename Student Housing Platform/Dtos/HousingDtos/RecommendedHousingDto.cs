namespace Student_Housing_Platform.Dtos.HousingDtos
{
    public class RecommendedHousingDto
    {
        public int HousingId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int MatchScore { get; set; }
        public double DistanceKm { get; set; }
        public decimal Price { get; set; }
        public double Rating { get; set; }
    }
}
