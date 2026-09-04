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
        [MaxLength(50)]
        public string? NationalId { get; set; }
        [MaxLength(50)]
        public string? UniversityId { get; set; }
        [MaxLength(150)]
        public string? University { get; set; }
        [Phone, MaxLength(30)]
        public string? Mobile { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required] public string CurrentPassword { get; set; } = string.Empty;
        [Required, MinLength(6)] public string NewPassword { get; set; } = string.Empty;
    }
}
