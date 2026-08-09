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
    }
}
