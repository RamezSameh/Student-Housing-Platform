using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Housing_Platform.Models
{
    public class HousingImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int HousingId { get; set; }
        [ForeignKey("HousingId")]
        public Housing Housing { get; set; }

        [Required]
        public string ImageUrl { get; set; } = string.Empty;
        public string? PublicId { get; set; }
        public bool IsPrimary { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
