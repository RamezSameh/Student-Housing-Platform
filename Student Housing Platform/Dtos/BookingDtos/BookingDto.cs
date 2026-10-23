namespace Student_Housing_Platform.Dtos.BookingDtos
{
    // ايصال الحجز
    // to pass for checkout page and booking confirmation
    public class BookingDto
    {
        
        public int BookingId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalCost { get; set; }
        public string Status { get; set; } = string.Empty; // (Pending, Confirmed, Successed, Failed)

        // from Room navigation property
        public string RoomNumber { get; set; } = string.Empty;
        public int Floor { get; set; }
        // from HousingType navigation property (via HousingRoom)
        public string RoomTypeName { get; set; } = string.Empty;
        // from payment navigation property
        public string PaymentMethod { get; set; } = string.Empty; // (Stripe, CashOnArrival)
        public string PaymentStatus { get; set; } = string.Empty; // (Succeeded, Pending, Failed)
        public string NationalId { get; set; } = string.Empty;
        public string UniversityId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string Mobile { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int DurationMonths { get; set; }
        public string? Notes { get; set; }
        public DateTime ApprovalDeadline { get; set; }
    }
}
