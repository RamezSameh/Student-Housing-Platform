using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.Admin;
using Student_Housing_Platform.Models.Enums;

namespace Student_Housing_Platform.Services.Admin
{
    public class AdminService : IAdminService
    {
        private readonly SHP_DbContext _context;
        public AdminService(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default)
        {
            var totalUsers = await _context.Users.CountAsync(cancellationToken);

            // user roles are stored in AspNetUserRoles, join with Roles to compute accurate counts
            var userRoles = _context.Set<IdentityUserRole<string>>();
            var roles = _context.Roles;

            var totalStudents = await (from ur in userRoles
                                       join r in roles on ur.RoleId equals r.Id
                                       where r.Name == "Student"
                                       select ur.UserId).Distinct().CountAsync(cancellationToken);

            var totalOwners = await (from ur in userRoles
                                     join r in roles on ur.RoleId equals r.Id
                                     where r.Name == "Owner"
                                     select ur.UserId).Distinct().CountAsync(cancellationToken);

            var totalUniversities = await _context.Universities.CountAsync(cancellationToken);
            var totalHousing = await _context.Housings.CountAsync(cancellationToken);
            var verifiedHousing = await _context.Housings.CountAsync(h => h.IsVerified, cancellationToken);
            var pendingHousing = await _context.Housings.CountAsync(h => !h.IsVerified && h.IsAvailable, cancellationToken);
            var totalBookings = await _context.Bookings.CountAsync(cancellationToken);
            var pendingBookings = await _context.Bookings.CountAsync(b => b.bookingStatus == BookingStatus.Pending, cancellationToken);
            var confirmedBookings = await _context.Bookings.CountAsync(b => b.bookingStatus == BookingStatus.Confirmed, cancellationToken);
            var cancelledBookings = await _context.Bookings.CountAsync(b => b.bookingStatus == BookingStatus.Cancelled, cancellationToken);
            var totalRevenue = await _context.Payments
                .Where(p => p.Status == PaymentStatus.Succeeded)
                .SumAsync(p => (decimal?)p.Amount, cancellationToken) ?? 0;
            var unreadContactMessages = await _context.ContactMessages
                .CountAsync(m => !m.IsRead, cancellationToken);

            return new AdminDashboardDto
            {
                TotalUsers = totalUsers,
                TotalStudents = totalStudents,
                TotalOwners = totalOwners,
                TotalUniversities = totalUniversities,
                TotalHousing = totalHousing,
                VerifiedHousing = verifiedHousing,
                PendingHousing = pendingHousing,
                TotalBookings = totalBookings,
                PendingBookings = pendingBookings,
                ConfirmedBookings = confirmedBookings,
                CancelledBookings = cancelledBookings,
                TotalRevenue = totalRevenue,
                UnreadContactMessages = unreadContactMessages
            };
        }
    }
}
