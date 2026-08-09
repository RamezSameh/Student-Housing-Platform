using Student_Housing_Platform.Models.Enums;

namespace Student_Housing_Platform.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        [Required]
        public DateTime CheckInDate { get; set; }
        [Required]
        public DateTime CheckOutDate { get; set; }
        [Required]
        public DateTime BookingDate { get; set; } 
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        [Required]
        public BookingStatus bookingStatus { get; set; } = BookingStatus.Pending;

        // --------------- Relationships ----------------
        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } // many bookings by one user

        // legacy Room bookings (existing short-stay model)
        public int? RoomId { get; set; }
        [ForeignKey("RoomId")]
        public Room? Room { get; set; }

        // new Housing booking support
        public int? HousingId { get; set; }
        [ForeignKey("HousingId")]
        public Housing? Housing { get; set; }

        public int? HousingRoomId { get; set; }
        [ForeignKey("HousingRoomId")]
        public HousingRoom? HousingRoom { get; set; }

        public Payment Payment { get; set; } //one booking to one payment

        public Review Review { get; set; } // one booking to one review
    }
}
