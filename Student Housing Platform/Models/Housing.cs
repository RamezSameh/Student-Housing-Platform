using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace Student_Housing_Platform.Models
{
    public class Housing
    {
        [Key]
        public int HousingId { get; set; }

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
        [Range(-90.0, 90.0)]
        public double Latitude { get; set; }

        [Required]
        [Range(-180.0, 180.0)]
        public double Longitude { get; set; }
        // Spatial location (Geo) - longitude, latitude
        public Point? Location { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        [Required]
        [MaxLength(50)]
        public string HousingTypeName { get; set; } = string.Empty;
        public HousingType HousingType { get; set; }

        [MaxLength(50)]
        public string? GenderType { get; set; }

        public bool IsFurnished { get; set; } = false;
        public bool IsVerified { get; set; } = false;
        public bool IsAvailable { get; set; } = true;

        // Owner (user) reference
        [Required]
        public string OwnerId { get; set; }
        public ApplicationUser Owner { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        public ICollection<HousingRoom>? Rooms { get; set; }
        public ICollection<HousingImage>? Images { get; set; }
        public ICollection<HousingAmenity>? HousingAmenities { get; set; }
        public ICollection<HousingReview>? HousingReviews { get; set; }
    }
}
