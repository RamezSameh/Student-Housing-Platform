namespace Student_Housing_Platform.Dtos.HousingDtos
{
    public class HousingSearchResultDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public double DistanceKm { get; set; }
        public double Rating { get; set; }
        public bool IsVerified { get; set; }
        public string City { get; set; } = string.Empty;
        public string? HousingType { get; set; }
        public bool IsFurnished { get; set; }
    }
}
