using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.HousingDtos;
using Student_Housing_Platform.Models.Enums;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.Controllers
{
    // Everything a property owner needs to manage their own listings:
    // their housings (with quick stats), the bookings made against those
    // housings, and a small dashboard summary. All scoped strictly to the
    // logged-in owner — there is no cross-owner data here.
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Owner")]
    public class OwnerController : ControllerBase
    {
        private readonly IHousingRepository _housingRepository;
        private readonly IBookingRepository _bookingRepository;
        private readonly SHP_DbContext _context;

        public OwnerController(
            IHousingRepository housingRepository,
            IBookingRepository bookingRepository,
            SHP_DbContext context)
        {
            _housingRepository = housingRepository;
            _bookingRepository = bookingRepository;
            _context = context;
        }

        private string? CurrentOwnerId =>
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        // GET: api/Owner/housings
        [HttpGet("housings")]
        public async Task<IActionResult> GetMyHousings(CancellationToken cancellationToken)
        {
            var ownerId = CurrentOwnerId;
            if (ownerId == null) return Unauthorized();

            var housings = await _housingRepository.GetByOwnerAsync(ownerId, cancellationToken);
            return Ok(new { success = true, data = housings });
        }

        // GET: api/Owner/bookings
        [HttpGet("bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var ownerId = CurrentOwnerId;
            if (ownerId == null) return Unauthorized();

            var bookings = await _bookingRepository.GetBookingsForOwnerAsync(ownerId);
            return Ok(new { success = true, data = bookings });
        }

        [HttpPost("bookings/{bookingId}/approve")]
        public async Task<IActionResult> ApproveBooking(int bookingId)
        {
            if (CurrentOwnerId == null) return Unauthorized();
            try { return Ok(await _bookingRepository.ApproveBookingAsync(bookingId, CurrentOwnerId)); }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
            catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("bookings/{bookingId}/reject")]
        public async Task<IActionResult> RejectBooking(int bookingId)
        {
            if (CurrentOwnerId == null) return Unauthorized();
            try { return Ok(await _bookingRepository.RejectBookingAsync(bookingId, CurrentOwnerId)); }
            catch (KeyNotFoundException ex) { return NotFound(ex.Message); }
            catch (InvalidOperationException ex) { return BadRequest(ex.Message); }
        }

        // GET: api/Owner/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboard(CancellationToken cancellationToken)
        {
            var ownerId = CurrentOwnerId;
            if (ownerId == null) return Unauthorized();

            var housingIds = await _context.Housings
                .Where(h => h.OwnerId == ownerId)
                .Select(h => h.HousingId)
                .ToListAsync(cancellationToken);

            var totalHousings = housingIds.Count;
            var verifiedHousings = await _context.Housings
                .CountAsync(h => h.OwnerId == ownerId && h.IsVerified, cancellationToken);

            var totalRooms = await _context.HousingRooms
                .CountAsync(r => housingIds.Contains(r.HousingId), cancellationToken);
            var availableRooms = await _context.HousingRooms
                .CountAsync(r => housingIds.Contains(r.HousingId) && r.IsAvailable && r.AvailableBeds > 0, cancellationToken);

            var totalBookings = await _context.Bookings
                .CountAsync(b => b.HousingId != null && housingIds.Contains(b.HousingId.Value), cancellationToken);
            var pendingBookings = await _context.Bookings
                .CountAsync(b => b.HousingId != null && housingIds.Contains(b.HousingId.Value) && b.bookingStatus == BookingStatus.Pending, cancellationToken);
            var confirmedBookings = await _context.Bookings
                .CountAsync(b => b.HousingId != null && housingIds.Contains(b.HousingId.Value) && b.bookingStatus == BookingStatus.Confirmed, cancellationToken);
            var cancelledBookings = await _context.Bookings
                .CountAsync(b => b.HousingId != null && housingIds.Contains(b.HousingId.Value) && b.bookingStatus == BookingStatus.Cancelled, cancellationToken);

            var totalRevenue = await _context.Payments
                .Where(p => p.Status == PaymentStatus.Succeeded
                    && p.Booking != null
                    && p.Booking.HousingId != null
                    && housingIds.Contains(p.Booking.HousingId.Value))
                .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0;

            var dto = new OwnerDashboardDto
            {
                TotalHousings = totalHousings,
                VerifiedHousings = verifiedHousings,
                PendingHousings = totalHousings - verifiedHousings,
                TotalRooms = totalRooms,
                AvailableRooms = availableRooms,
                TotalBookings = totalBookings,
                PendingBookings = pendingBookings,
                ConfirmedBookings = confirmedBookings,
                CancelledBookings = cancelledBookings,
                TotalRevenue = totalRevenue
            };

            return Ok(new { success = true, data = dto });
        }
    }
}
