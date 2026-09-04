namespace Student_Housing_Platform.Dtos.AccountDtos.LoginDtos
{
    public class LoginResponseDto
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
        public IList<string> Roles { get; set; }
        public string NationalId { get; set; }
        public string UniversityId { get; set; }
        public string University { get; set; }
        public string Mobile { get; set; }
    }
}
