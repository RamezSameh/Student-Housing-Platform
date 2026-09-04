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
        [Required, MaxLength(50)]
        public string NationalId { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string UniversityId { get; set; } = string.Empty;
        [Required, MaxLength(150)]
        public string StudentName { get; set; } = string.Empty;
        [Required, MaxLength(30)]
        public string Mobile { get; set; } = string.Empty;
        [Required, EmailAddress, MaxLength(320)]
        public string Email { get; set; } = string.Empty;
        [Required, Range(1, 120)]
        public int DurationMonths { get; set; }
        [MaxLength(2000)]
        public string? Notes { get; set; }
        [Required]
        public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.Stripe;
        public DateTime ApprovalDeadline { get; set; }
        public bool FinalReminderSent { get; set; }

        // --------------- Relationships ----------------
        [Required]
        public string UserId { get; set; }

        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; } // many bookings by one user


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
