using System.ComponentModel.DataAnnotations;

namespace Student_Housing_Platform.Models
{
    public class HousingAmenity
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HousingId { get; set; }
        public Housing Housing { get; set; }

        [Required]
        public int AmenityId { get; set; }
        public Amenity Amenity { get; set; }
    }
}
