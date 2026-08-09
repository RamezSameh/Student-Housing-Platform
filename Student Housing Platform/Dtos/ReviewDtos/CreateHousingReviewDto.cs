using System.ComponentModel.DataAnnotations;

namespace Student_Housing_Platform.Dtos.ReviewDtos
{
    public class CreateHousingReviewDto
    {
        [Required]
        public int HousingId { get; set; }

        [Required]
        [Range(1,5)]
        public int Rating { get; set; }

        [MaxLength(1500)]
        public string? Comment { get; set; }
    }
}
