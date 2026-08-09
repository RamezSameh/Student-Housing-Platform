using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.HousingDtos;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.Services.Distance;

namespace Student_Housing_Platform.Services.Recommendation
{
    public class RecommendationService : IRecommendationService
    {
        private readonly SHP_DbContext _context;
        private readonly IDistanceCalculator _distanceCalculator;

        public RecommendationService(SHP_DbContext context, IDistanceCalculator distanceCalculator)
        {
            _context = context;
            _distanceCalculator = distanceCalculator;
        }

        public async Task<PagedResultDto<RecommendedHousingDto>> RecommendAsync(
            int? universityId = null,
            decimal? maxBudget = null,
            double? maxDistance = null,
            string? roomType = null,
            string? genderPreference = null,
            List<int>? requiredAmenities = null,
            double? minimumRating = null,
            int page = 1,
            int pageSize = 20,
            CancellationToken cancellationToken = default)
        {
            double? uniLat = null;
            double? uniLon = null;
            if (universityId.HasValue)
            {
                var uni = await _context.Universities.AsNoTracking().FirstOrDefaultAsync(u => u.UniversityId == universityId.Value, cancellationToken);
                if (uni != null)
                {
                    uniLat = uni.Latitude;
                    uniLon = uni.Longitude;
                }
            }

            var query = _context.Housings.AsNoTracking().Where(h => h.IsAvailable);
            if (maxBudget.HasValue) query = query.Where(h => h.Price <= maxBudget.Value);
            if (!string.IsNullOrEmpty(genderPreference)) query = query.Where(h => h.GenderType == genderPreference);
            if (!string.IsNullOrEmpty(roomType)) query = query.Where(h => h.Rooms.Any(r => r.RoomType == roomType));
            if (requiredAmenities != null && requiredAmenities.Any())
            {
                foreach (var aid in requiredAmenities)
                {
                    var id = aid;
                    query = query.Where(h => h.HousingAmenities.Any(ha => ha.AmenityId == id));
                }
            }

            // bounding box for maxDistance
            if (maxDistance.HasValue && uniLat.HasValue && uniLon.HasValue)
            {
                var lat = uniLat.Value;
                var lon = uniLon.Value;
                var latDegree = maxDistance.Value / 111.0;
                var lonDegree = maxDistance.Value / (111.320 * Math.Cos(lat * Math.PI / 180.0));
                var minLat = lat - latDegree;
                var maxLat = lat + latDegree;
                var minLon = lon - lonDegree;
                var maxLon = lon + lonDegree;
                query = query.Where(h => h.Latitude >= minLat && h.Latitude <= maxLat && h.Longitude >= minLon && h.Longitude <= maxLon);
            }

            var candidates = await query.Select(h => new { h.HousingId, h.Title, h.Price, h.Latitude, h.Longitude, h.IsVerified, h.City }).ToListAsync(cancellationToken);

            if (!candidates.Any())
            {
                return new PagedResultDto<RecommendedHousingDto> { Items = Enumerable.Empty<RecommendedHousingDto>(), Page = page, PageSize = pageSize, TotalCount = 0 };
            }

            var housingIds = candidates.Select(c => c.HousingId).ToList();

            // bulk average ratings
            var ratings = await _context.HousingReviews
                .Where(r => housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new { HousingId = g.Key, Avg = g.Average(x => x.Rating) })
                .ToListAsync(cancellationToken);

            // amenities map
            var amenitiesMap = await _context.HousingAmenities
                .Where(ha => housingIds.Contains(ha.HousingId))
                .GroupBy(ha => ha.HousingId)
                .ToDictionaryAsync(g => g.Key, g => g.Select(x => x.AmenityId).ToList(), cancellationToken);

            var results = new List<RecommendedHousingDto>();
            foreach (var item in candidates)
            {
                double distanceKm = 0;
                if (uniLat.HasValue && uniLon.HasValue)
                {
                    distanceKm = _distanceCalculator.CalculateDistanceKm(uniLat.Value, uniLon.Value, item.Latitude, item.Longitude);
                }

                // price score (lower price better). If no maxBudget use neutral 1.
                double priceScore = 1.0;
                if (maxBudget.HasValue)
                {
                    if (item.Price <= maxBudget.Value) priceScore = 1.0 - (double)(item.Price / maxBudget.Value);
                    else priceScore = 0.0;
                    priceScore = Math.Clamp(priceScore, 0.0, 1.0);
                }

                // distance score
                double distanceScore = 1.0;
                if (maxDistance.HasValue && maxDistance.Value > 0)
                {
                    distanceScore = 1.0 - (distanceKm / maxDistance.Value);
                    distanceScore = Math.Clamp(distanceScore, 0.0, 1.0);
                }

                // amenities score
                double amenitiesScore = 1.0;
                if (requiredAmenities != null && requiredAmenities.Any())
                {
                    if (amenitiesMap.TryGetValue(item.HousingId, out var present))
                    {
                        var matched = requiredAmenities.Count(a => present.Contains(a));
                        amenitiesScore = (double)matched / requiredAmenities.Count;
                    }
                    else amenitiesScore = 0.0;
                }

                // rating score (avg/5)
                var avgRating = ratings.FirstOrDefault(r => r.HousingId == item.HousingId)?.Avg ?? 0.0;
                double ratingScore = avgRating / 5.0;

                // room type score: check if any room matches - doing simple query
                double roomScore = 1.0;
                if (!string.IsNullOrEmpty(roomType))
                {
                    var exists = await _context.HousingRooms.AnyAsync(r => r.HousingId == item.HousingId && r.RoomType == roomType, cancellationToken);
                    roomScore = exists ? 1.0 : 0.0;
                }

                // compute weighted score
                double score = priceScore * 0.30 + distanceScore * 0.30 + amenitiesScore * 0.20 + ratingScore * 0.10 + roomScore * 0.10;
                var matchScore = (int)Math.Round(score * 100);

                results.Add(new RecommendedHousingDto
                {
                    HousingId = item.HousingId,
                    Title = item.Title,
                    MatchScore = matchScore,
                    DistanceKm = Math.Round(distanceKm, 2),
                    Price = item.Price,
                    Rating = Math.Round(avgRating, 2)
                });
            }

            // filter by minimumRating and sort by matchScore desc
            if (minimumRating.HasValue)
            {
                results = results.Where(r => r.Rating >= minimumRating.Value).ToList();
            }

            var ordered = results.OrderByDescending(r => r.MatchScore).ThenBy(r => r.DistanceKm).ToList();
            var total = ordered.Count;
            var itemsPage = ordered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResultDto<RecommendedHousingDto>
            {
                Items = itemsPage,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }
    }
}
