namespace Student_Housing_Platform.Models
{
    public class ApplicationUser:IdentityUser
    {
        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MinLength(2)]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string NationalId { get; set; } = string.Empty;
        [MaxLength(50)]
        public string? UniversityId { get; set; }
        [Required, MaxLength(150)]
        public string University { get; set; } = string.Empty;
        [Required, MaxLength(30)]
        public string Mobile { get; set; } = string.Empty;
        
        //Relationships
        public ICollection<Booking> Bookings { get; set; } = null!; // many bookings by one user
        public ICollection<Review> Reviews { get; set; } = null!;  // may reviews by one user
    }
}
