namespace Student_Housing_Platform.Dtos.AccountDtos

{
    public class UserWithRolesDto
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IEnumerable<string> Roles { get; set; }
    }
}
