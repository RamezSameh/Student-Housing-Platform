using Student_Housing_Platform.Dtos.ReviewDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IHousingReviewRepository
    {
        Task<HousingReviewDto> CreateAsync(CreateHousingReviewDto dto, string userId);
        Task<IEnumerable<HousingReviewDto>> GetByHousingIdAsync(int housingId);
        Task<double> GetAverageRatingAsync(int housingId);
    }
}
