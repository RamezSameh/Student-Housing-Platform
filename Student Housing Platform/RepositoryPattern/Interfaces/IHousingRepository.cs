using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.HousingDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IHousingRepository
    {
        Task<PagedResultDto<HousingListItemDto>> GetNearbyAsync(int universityId, double radiusKm, int page, int pageSize, CancellationToken cancellationToken = default);
        Task<PagedResultDto<HousingListItemDto>> SearchAsync(
            int? universityId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            double? maxDistance = null,
            string? housingType = null,
            string? roomType = null,
            string? genderType = null,
            bool? isFurnished = null,
            List<int>? amenities = null,
            double? minimumRating = null,
            string? sortBy = null,
            string? sortDirection = null,
            int page = 1,
            int pageSize = 20,
            CancellationToken cancellationToken = default);
        Task<HousingDetailDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<int> CreateAsync(CreateHousingDto dto, string ownerId, CancellationToken cancellationToken = default);
        Task<bool> UpdateAsync(int id, UpdateHousingDto dto, string userId, bool isAdmin = false);
        Task<bool> DeleteAsync(int id, string userId, bool isAdmin = false);
        Task<IEnumerable<HousingListItemDto>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
        Task<IEnumerable<Student_Housing_Platform.Dtos.HousingDtos.CompareHousingDto>> GetCompareByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
        Task AddHousingImageAsync(int housingId, string imageUrl, string publicId, bool isPrimary = false);
        Task<bool> DeleteHousingImageAsync(int imageId);
        Task<string?> GetOwnerIdAsync(int housingId);
        Task<HousingImage?> GetImageByIdAsync(int imageId);
        Task<IEnumerable<OwnerHousingDto>> GetByOwnerAsync(string ownerId, CancellationToken cancellationToken = default);
        Task<IEnumerable<AdminHousingDto>> GetPendingVerificationAsync(CancellationToken cancellationToken = default);
        Task<bool> SetVerifiedAsync(int id, bool isVerified, CancellationToken cancellationToken = default);
    }
}
