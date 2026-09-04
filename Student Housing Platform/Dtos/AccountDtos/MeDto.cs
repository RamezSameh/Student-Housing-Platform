namespace Student_Housing_Platform.Dtos.AccountDtos
{
    public class MeDto
    {
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
