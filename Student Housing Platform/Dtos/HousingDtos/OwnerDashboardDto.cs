namespace Student_Housing_Platform.Dtos.HousingDtos
{
    public class OwnerDashboardDto
    {
        public int TotalHousings { get; set; }
        public int VerifiedHousings { get; set; }
        public int PendingHousings { get; set; }
        public int TotalRooms { get; set; }
        public int AvailableRooms { get; set; }
        public int TotalBookings { get; set; }
        public int PendingBookings { get; set; }
        public int ConfirmedBookings { get; set; }
        public int CancelledBookings { get; set; }
        public decimal TotalRevenue { get; set; }
    }
}
