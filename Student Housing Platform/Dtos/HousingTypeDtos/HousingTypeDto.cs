namespace Student_Housing_Platform.Dtos.HousingTypeDtos
{
    public class HousingTypeDto
    {
        public int HousingTypeIdDto { get; set; }
        [Required]
        [MaxLength(100)]
        public string HousingTypeNameDto { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? HousingTypeDescriptionDto { get; set; }
        [Required]
        public int HousingTypeCapacityDto { get; set; }
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal HousingTypePricePerMonthDto { get; set; }
    }
}
