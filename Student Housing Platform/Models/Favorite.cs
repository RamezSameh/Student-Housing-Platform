using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Housing_Platform.Models
{
    public class Favorite
    {
        [Required]
        public string UserId { get; set; }

        [Required]
        public int HousingId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // navigation
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }
        public Housing Housing { get; set; }
    }
}
