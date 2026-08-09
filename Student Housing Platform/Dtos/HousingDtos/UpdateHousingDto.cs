using System.ComponentModel.DataAnnotations;

namespace Student_Housing_Platform.Dtos.HousingDtos
{
    public class UpdateHousingDto
    {
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(4000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(300)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [Range(-90.0,90.0)]
        public double Latitude { get; set; }

        [Required]
        [Range(-180.0,180.0)]
        public double Longitude { get; set; }

        [Required]
        [Range(0.0,double.MaxValue)]
        public decimal Price { get; set; }

        public string? HousingType { get; set; }
        public string? GenderType { get; set; }
        public bool IsFurnished { get; set; } = false;
        public bool IsAvailable { get; set; } = true;
        public bool IsVerified { get; set; } = false;
    }
}
