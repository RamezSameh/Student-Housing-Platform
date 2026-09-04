namespace Student_Housing_Platform.Dtos.AccountDtos
{
    public class MeDto
    {
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
        public string NationalId { get; set; } = string.Empty;
        public string? UniversityId { get; set; }
        public string University { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
    }
}
