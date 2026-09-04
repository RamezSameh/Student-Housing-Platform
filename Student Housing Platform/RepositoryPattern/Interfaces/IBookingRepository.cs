using Student_Housing_Platform.Dtos.BookingDtos;
using Student_Housing_Platform.Models.Enums;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IBookingRepository
    {
        Task<Booking> CreateBookingAsync(CreateBookingDto createBookingDto,string UserId);
        Task<Booking> CreateHousingBookingAsync(CreateHousingBookingDto createHousingBookingDto, string userId);
        Task<BookingDto> GetBookingByIdAsync(int bookingId, string userId);
        Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId);
        Task<Booking> UpdateBookingStatusAsync(int bookingId, BookingStatus newStatus);
        Task<Booking> GetBookingEntityByIdAsync(int bookingId, string userId);
        //Aggregate Root 
        Task ConfirmPaymentAsync(int bookingId, string userId, string transactionId);

        // Management views (Owner Dashboard / Admin Dashboard)
        Task<IEnumerable<ManagementBookingDto>> GetBookingsForOwnerAsync(string ownerId);
        Task<IEnumerable<ManagementBookingDto>> GetAllBookingsAsync();
        Task<Booking> ApproveBookingAsync(int bookingId, string ownerId);
        Task<Booking> RejectBookingAsync(int bookingId, string ownerId);
        Task<int> ProcessApprovalDeadlinesAsync(DateTime utcNow, CancellationToken cancellationToken);
    }
}
