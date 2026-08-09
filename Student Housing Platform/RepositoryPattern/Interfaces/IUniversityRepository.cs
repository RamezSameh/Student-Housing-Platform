using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.UniversityDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IUniversityRepository
    {
        Task<PagedResultDto<UniversityDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
        Task<UniversityDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
        Task<UniversityDto> CreateAsync(CreateUniversityDto dto, CancellationToken cancellationToken = default);
        Task<bool> UpdateAsync(int id, UpdateUniversityDto dto, CancellationToken cancellationToken = default);
        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
