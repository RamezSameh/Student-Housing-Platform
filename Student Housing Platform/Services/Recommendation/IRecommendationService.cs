using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.HousingDtos;

namespace Student_Housing_Platform.Services.Recommendation
{
    public interface IRecommendationService
    {
        Task<PagedResultDto<RecommendedHousingDto>> RecommendAsync(
            int? universityId = null,
            decimal? maxBudget = null,
            double? maxDistance = null,
            string? roomType = null,
            string? genderPreference = null,
            List<int>? requiredAmenities = null,
            double? minimumRating = null,
            int page = 1,
            int pageSize = 20,
            CancellationToken cancellationToken = default);
    }
}
