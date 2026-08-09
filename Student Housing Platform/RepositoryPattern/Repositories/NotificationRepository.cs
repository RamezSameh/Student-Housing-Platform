using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly SHP_DbContext _context;
        public NotificationRepository(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId)
        {
            return await _context.Notifications.Where(n => n.UserId == userId).OrderByDescending(n => n.CreatedAt).ToListAsync();
        }

        public async Task MarkAsReadAsync(int notificationId, string userId)
        {
            var n = await _context.Notifications.FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == userId);
            if (n == null) return;
            n.IsRead = true;
            _context.Notifications.Update(n);
            await _context.SaveChangesAsync();
        }

        public async Task SendNotificationAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }
    }
}
