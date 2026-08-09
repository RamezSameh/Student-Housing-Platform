using Student_Housing_Platform.Models;
using Student_Housing_Platform.Dtos.Common;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
        Task MarkAsReadAsync(int notificationId, string userId);
        Task SendNotificationAsync(Notification notification);
    }
}
