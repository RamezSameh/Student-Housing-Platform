using Student_Housing_Platform.Dtos.Admin;

namespace Student_Housing_Platform.Services.Admin
{
    public interface IAdminService
    {
        Task<AdminDashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default);
    }
}
