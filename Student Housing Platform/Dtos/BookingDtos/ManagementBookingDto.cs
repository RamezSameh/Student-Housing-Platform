namespace Student_Housing_Platform.Dtos.BookingDtos
{
    /// <summary>
    /// Booking row shape for management views (Owner Dashboard, Admin
    /// Dashboard) — unlike the student-facing BookingDto, this includes who
    /// the booking belongs to and which housing it's for, since a manager is
    /// looking across many users/housings at once rather than just their own.
    /// </summary>
    public class ManagementBookingDto
    {
        public int BookingId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public DateTime BookingDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;

        public int? HousingId { get; set; }
        public string? HousingTitle { get; set; }

        public int? HousingRoomId { get; set; }
        public string? RoomType { get; set; }

        public string StudentId { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string? StudentEmail { get; set; }

        public string PaymentMethod { get; set; } = "N/A";
        public string PaymentStatus { get; set; } = "N/A";
    }
}
