namespace Student_Housing_Platform.Dtos.HousingDtos
{
    public class HousingListItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public double DistanceKm { get; set; }
        public double Rating { get; set; }
        public bool IsVerified { get; set; }
        public string City { get; set; } = string.Empty;

        // Populated for GET /housings/{id} only (empty for list/search results,
        // which don't need per-room detail). Needed by the frontend to submit
        // a booking request against a specific room.
        public List<HousingRoomDto> Rooms { get; set; } = new();
    }

    public class HousingRoomDto
    {
        public int HousingRoomId { get; set; }
        public string? RoomType { get; set; }
        public int Capacity { get; set; }
        public int AvailableBeds { get; set; }
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
    }
}
