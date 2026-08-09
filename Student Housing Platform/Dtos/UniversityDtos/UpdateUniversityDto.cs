using System.ComponentModel.DataAnnotations;

namespace Student_Housing_Platform.Dtos.UniversityDtos
{
    public class UpdateUniversityDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
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

        public bool IsActive { get; set; } = true;
    }
}
