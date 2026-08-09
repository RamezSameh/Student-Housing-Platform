namespace Student_Housing_Platform.Dtos.HousingDtos
{
    public class CompareHousingDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public double DistanceKm { get; set; }
        public double Rating { get; set; }
        public string RoomTypes { get; set; } = string.Empty;
        public string Amenities { get; set; } = string.Empty;
        public bool IsFurnished { get; set; }
        public bool IsAvailable { get; set; }
    }
}
