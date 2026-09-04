using System.ComponentModel.DataAnnotations;

namespace Student_Housing_Platform.Dtos.BookingDtos
{
    public class CreateHousingBookingDto
    {
        [Required]
        public int HousingRoomId { get; set; }
        [Required]
        public DateTime CheckIn { get; set; }
        [Required]
        public DateTime CheckOut { get; set; }
        [Required] public string NationalId { get; set; } = string.Empty;
        public string? UniversityId { get; set; }
        [Required] public string StudentName { get; set; } = string.Empty;
        [Required] public string Mobile { get; set; } = string.Empty;
        [Required, EmailAddress] public string Email { get; set; } = string.Empty;
        [Required, Range(1, 120)] public int DurationMonths { get; set; }
        public string? Notes { get; set; }
        [Required] public PaymentMethod PaymentMethod { get; set; }
    }
}
