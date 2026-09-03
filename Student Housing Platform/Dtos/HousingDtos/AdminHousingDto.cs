namespace Student_Housing_Platform.Dtos.HousingDtos
{
    /// <summary>
    /// Row shape for admin housing-management views (e.g. the pending
    /// verification queue) — includes owner identity, which an owner's own
    /// dashboard doesn't need to repeat about themselves.
    /// </summary>
    public class AdminHousingDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsVerified { get; set; }
        public string OwnerId { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string? OwnerEmail { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SetVerifiedDto
    {
        public bool IsVerified { get; set; }
    }
}
