namespace Student_Housing_Platform.Dtos.AccountDtos.LoginDtos
{
    public class LoginResponseDto
    {
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
        public string NationalId { get; set; } = string.Empty;
        public string UniversityId { get; set; } = string.Empty;
        public string University { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
    }
}
