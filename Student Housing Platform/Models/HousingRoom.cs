using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Housing_Platform.Models
{
    public class HousingRoom
    {
        [Key]
        public int RoomId { get; set; }

        [Required]
        public int HousingId { get; set; }
        [ForeignKey("HousingId")]
        public Housing Housing { get; set; }

        [MaxLength(100)]
        public string? RoomType { get; set; }

        [Required]
        public int Capacity { get; set; }

        [Required]
        public int AvailableBeds { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}
