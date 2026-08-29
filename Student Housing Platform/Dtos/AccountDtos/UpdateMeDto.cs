namespace Student_Housing_Platform.Dtos.AccountDtos
{
    public class UpdateMeDto
    {
        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
    }
}
