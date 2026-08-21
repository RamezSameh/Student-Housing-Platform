using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Housing_Platform.Models
{
    public class UniversityHousing
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UniversityId { get; set; }

        [ForeignKey(nameof(UniversityId))]
        public University University { get; set; } = null!;

        [Required]
        public int HousingId { get; set; }

        [ForeignKey(nameof(HousingId))]
        public Housing Housing { get; set; } = null!;
    }
}