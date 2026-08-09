using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations;

namespace Student_Housing_Platform.Models
{
    public class Amenity
    {
        [Key]
        public int AmenityId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public ICollection<HousingAmenity>? HousingAmenities { get; set; }
    }
}
