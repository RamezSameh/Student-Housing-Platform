using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Housing_Platform.Models
{
    public class HousingReview
    {
        [Key]
        public int HousingReviewId { get; set; }

        [Required]
        public int HousingId { get; set; }
        [ForeignKey("HousingId")]
        public Housing Housing { get; set; }

        [Required]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        [Required]
        [Range(1,5)]
        public int Rating { get; set; }

        [MaxLength(1500)]
        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
