namespace Student_Housing_Platform.Dtos.HousingDtos
{
    /// <summary>
    /// Summary row for GET /api/owner/housings — one per housing the current
    /// owner has listed, with just enough counts to render a management list
    /// without a separate request per housing.
    /// </summary>
    public class OwnerHousingDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsVerified { get; set; }
        public string? PrimaryImageUrl { get; set; }
        public int RoomCount { get; set; }
        public int BookingCount { get; set; }
        public double Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
