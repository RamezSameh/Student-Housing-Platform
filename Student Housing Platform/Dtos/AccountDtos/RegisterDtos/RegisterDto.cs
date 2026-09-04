namespace Student_Housing_Platform.Dtos.AccountDtos.RegisterDtos
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string NationalId { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? UniversityId { get; set; }
        [Required, MaxLength(150)]
        public string University { get; set; } = string.Empty;
        [Required, Phone, MaxLength(30)]
        public string Mobile { get; set; } = string.Empty;
    }

    public class CreateOwnerDto
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string FirstName { get; set; } = string.Empty;
        [Required]
        public string LastName { get; set; } = string.Empty;
    }
}
