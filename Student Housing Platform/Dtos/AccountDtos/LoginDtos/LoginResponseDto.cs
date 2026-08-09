namespace Student_Housing_Platform.Dtos.AccountDtos.LoginDtos
{
    public class LoginResponseDto
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Token { get; set; }
        public IList<string> Roles { get; set; }
    }
}
