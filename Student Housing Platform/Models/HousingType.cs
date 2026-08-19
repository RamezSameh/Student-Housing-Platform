namespace Student_Housing_Platform.Models
{
    public class HousingType
    {
        [Key]
        public int HousingTypeId { get; set; }
        [Required]
        [MaxLength(100)]
        public string HousingTypeName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        public int Capacity { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal PricePerMonth { get; set; }
        public ICollection<Housing> Housings { get; set; } // many housings can have same housing type

    }
}
