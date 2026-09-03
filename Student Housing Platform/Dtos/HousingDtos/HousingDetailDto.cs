namespace Student_Housing_Platform.Dtos.HousingDtos
{
    /// <summary>
    /// Full detail payload for GET /api/housings/{id}. Superset of
    /// HousingListItemDto: adds description, address, gender/furnished flags,
    /// housing type name, owner info, images, amenities and rooms — none of
    /// which the list/search endpoints need, so they keep using the lighter
    /// HousingListItemDto.
    /// </summary>
    public class HousingDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public decimal Price { get; set; }

        public int HousingTypeId { get; set; }
        public string? HousingTypeName { get; set; }

        public string? GenderType { get; set; }
        public bool IsFurnished { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsVerified { get; set; }

        public double DistanceKm { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public HousingOwnerDto? Owner { get; set; }

        public List<HousingImageDto> Images { get; set; } = new();
        public List<string> Amenities { get; set; } = new();
        public List<HousingRoomDto> Rooms { get; set; } = new();
    }

    public class HousingOwnerDto
    {
        public string OwnerId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
    }

    public class HousingImageDto
    {
        public int ImageId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsPrimary { get; set; }
    }
}
