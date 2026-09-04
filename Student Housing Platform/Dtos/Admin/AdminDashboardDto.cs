namespace Student_Housing_Platform.Dtos.Admin
{
    public class AdminDashboardDto
    {
        public int TotalUsers { get; set; }
        public int TotalStudents { get; set; }
        public int TotalOwners { get; set; }
        public int TotalUniversities { get; set; }
        public int TotalHousing { get; set; }
        public int VerifiedHousing { get; set; }
        public int PendingHousing { get; set; }
        public int TotalBookings { get; set; }
        public int PendingBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public decimal TotalRevenue { get; set; }
        public int UnreadContactMessages { get; set; }
    }
}
