using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.HousingDtos;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using Student_Housing_Platform.Services.Distance;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class HousingRepository : IHousingRepository
    {
        private readonly SHP_DbContext _context;
        private readonly IDistanceCalculator _distanceCalculator;

        public HousingRepository(SHP_DbContext context, IDistanceCalculator distanceCalculator)
        {
            _context = context;
            _distanceCalculator = distanceCalculator;
        }

        public async Task<string?> GetOwnerIdAsync(int housingId)
        {
            var h = await _context.Housings.FindAsync(housingId);
            return h?.OwnerId;
        }

        public async Task<HousingImage?> GetImageByIdAsync(int imageId)
        {
            return await _context.HousingImages.FindAsync(imageId);
        }

        public async Task<PagedResultDto<HousingListItemDto>> SearchAsync(
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

            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 20;

            // Base query with server-side filters
            var query = _context.Housings.AsNoTracking().Where(h => h.IsAvailable);

            if (minPrice.HasValue) query = query.Where(h => h.Price >= minPrice.Value);
            if (maxPrice.HasValue) query = query.Where(h => h.Price <= maxPrice.Value);
            if (!string.IsNullOrEmpty(housingType)) query = query.Where(h => h.HousingType == housingType);
            if (!string.IsNullOrEmpty(genderType)) query = query.Where(h => h.GenderType == genderType);
            if (isFurnished.HasValue) query = query.Where(h => h.IsFurnished == isFurnished.Value);

            if (amenities != null && amenities.Any())
            {
                // housings that contain all requested amenities
                foreach (var amenityId in amenities)
                {
                    var id = amenityId;
                    query = query.Where(h => h.HousingAmenities.Any(ha => ha.AmenityId == id));
                }
            }

            if (!string.IsNullOrEmpty(roomType))
            {
                query = query.Where(h => h.Rooms.Any(r => r.RoomType == roomType));
            }

            // Bounding box if distance filter provided
            double lat = 0, lon = 0;
            if (maxDistance.HasValue && uniLat.HasValue && uniLon.HasValue)
            {
                lat = uniLat.Value;
                lon = uniLon.Value;
                var latDegree = maxDistance.Value / 111.0;
                var lonDegree = maxDistance.Value / (111.320 * Math.Cos(lat * Math.PI / 180.0));
                var minLat = lat - latDegree;
                var maxLat = lat + latDegree;
                var minLon = lon - lonDegree;
                var maxLon = lon + lonDegree;
                query = query.Where(h => h.Latitude >= minLat && h.Latitude <= maxLat && h.Longitude >= minLon && h.Longitude <= maxLon);
            }

            // Project minimal fields to reduce data transfer
            var candidates = await query.Select(h => new { h.HousingId, h.Title, h.Price, h.Latitude, h.Longitude, h.IsVerified, h.City, h.HousingType, h.IsFurnished }).ToListAsync(cancellationToken);

            // Bulk ratings
            var housingIds = candidates.Select(c => c.HousingId).ToList();
            var ratings = await _context.HousingReviews.Where(r => housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new { HousingId = g.Key, Avg = g.Average(x => x.Rating) })
                .ToListAsync(cancellationToken);

            var results = candidates.Select(item => new HousingListItemDto
            {
                Id = item.HousingId,
                Title = item.Title,
                Price = item.Price,
                DistanceKm = (uniLat.HasValue && uniLon.HasValue) ? _distanceCalculator.CalculateDistanceKm(uniLat.Value, uniLon.Value, item.Latitude, item.Longitude) : 0,
                Rating = ratings.FirstOrDefault(r => r.HousingId == item.HousingId)?.Avg ?? 0,
                IsVerified = item.IsVerified,
                City = item.City
            }).ToList();

            // Apply distance and rating filters in-memory
            if (maxDistance.HasValue)
            {
                results = results.Where(r => r.DistanceKm <= maxDistance.Value).ToList();
            }
            if (minimumRating.HasValue)
            {
                results = results.Where(r => r.Rating >= minimumRating.Value).ToList();
            }

            // Sorting
            sortBy = sortBy?.ToLowerInvariant() ?? "distance";
            sortDirection = sortDirection?.ToLowerInvariant() ?? "asc";
            results = (sortBy, sortDirection) switch
            {
                ("price", "asc") => results.OrderBy(r => r.Price).ToList(),
                ("price", "desc") => results.OrderByDescending(r => r.Price).ToList(),
                ("rating", "desc") => results.OrderByDescending(r => r.Rating).ToList(),
                ("rating", "asc") => results.OrderBy(r => r.Rating).ToList(),
                ("newest", _) => results.OrderByDescending(r => r.Id).ToList(),
                _ => results.OrderBy(r => r.DistanceKm).ToList()
            };

            var total = results.Count;
            var items = results.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResultDto<HousingListItemDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }

        public async Task<IEnumerable<HousingListItemDto>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
        {
            var list = await _context.Housings.AsNoTracking()
                .Where(h => ids.Contains(h.HousingId))
                .Select(h => new { h.HousingId, h.Title, h.Price, h.Latitude, h.Longitude, h.IsVerified, h.City })
                .ToListAsync(cancellationToken);

            var housingIds = list.Select(i => i.HousingId).ToList();
            var ratings = await _context.HousingReviews
                .Where(r => housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new { HousingId = g.Key, Avg = g.Average(x => x.Rating) })
                .ToListAsync(cancellationToken);

            var mapped = list.Select(item => new HousingListItemDto
            {
                Id = item.HousingId,
                Title = item.Title,
                Price = item.Price,
                DistanceKm = 0,
                Rating = ratings.FirstOrDefault(r => r.HousingId == item.HousingId)?.Avg ?? 0,
                IsVerified = item.IsVerified,
                City = item.City
            }).ToList();

            return mapped;
        }

        public async Task<IEnumerable<Student_Housing_Platform.Dtos.HousingDtos.CompareHousingDto>> GetCompareByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default)
        {
            var list = await _context.Housings.AsNoTracking()
                .Where(h => ids.Contains(h.HousingId))
                .Select(h => new { h.HousingId, h.Title, h.Price, h.Latitude, h.Longitude, h.IsVerified, h.City, h.IsFurnished, h.IsAvailable })
                .ToListAsync(cancellationToken);

            var housingIds = list.Select(i => i.HousingId).ToList();
            var ratings = await _context.HousingReviews
                .Where(r => housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new { HousingId = g.Key, Avg = g.Average(x => x.Rating) })
                .ToListAsync(cancellationToken);

            var results = list.Select(item => new Student_Housing_Platform.Dtos.HousingDtos.CompareHousingDto
            {
                Id = item.HousingId,
                Title = item.Title,
                Price = item.Price,
                DistanceKm = 0, // client can request distance if needed
                Rating = ratings.FirstOrDefault(r => r.HousingId == item.HousingId)?.Avg ?? 0,
                RoomTypes = string.Empty,
                Amenities = string.Empty,
                IsFurnished = item.IsFurnished,
                IsAvailable = item.IsAvailable
            }).ToList();

            return results;
        }

        public async Task<int> CreateAsync(CreateHousingDto dto, string ownerId, CancellationToken cancellationToken = default)
        {
            var entity = new Housing
            {
                Title = dto.Title.Trim(),
                Description = dto.Description,
                Address = dto.Address.Trim(),
                City = dto.City.Trim(),
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Price = dto.Price,
                HousingType = dto.HousingType,
                GenderType = dto.GenderType,
                IsFurnished = dto.IsFurnished,
                IsAvailable = dto.IsAvailable,
                OwnerId = ownerId,
                CreatedAt = DateTime.UtcNow
            };
            await _context.Housings.AddAsync(entity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return entity.HousingId;
        }

        public async Task<bool> UpdateAsync(int id, UpdateHousingDto dto, string userId)
        {
            var entity = await _context.Housings.FindAsync(id);
            if (entity == null) return false;
            // only owner or admin should update - controller will check, but double-check here
            if (entity.OwnerId != userId)
            {
                return false;
            }

            entity.Title = dto.Title.Trim();
            entity.Description = dto.Description;
            entity.Address = dto.Address.Trim();
            entity.City = dto.City.Trim();
            entity.Latitude = dto.Latitude;
            entity.Longitude = dto.Longitude;
            entity.Price = dto.Price;
            entity.HousingType = dto.HousingType;
            entity.GenderType = dto.GenderType;
            entity.IsFurnished = dto.IsFurnished;
            entity.IsAvailable = dto.IsAvailable;
            entity.IsVerified = dto.IsVerified;
            entity.UpdatedAt = DateTime.UtcNow;
            // update spatial location
            entity.Location = new NetTopologySuite.Geometries.Point(dto.Longitude, dto.Latitude) { SRID = 4326 };

            _context.Housings.Update(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id, string userId)
        {
            var entity = await _context.Housings.FindAsync(id);
            if (entity == null) return false;
            if (entity.OwnerId != userId)
            {
                return false;
            }
            _context.Housings.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task AddHousingImageAsync(int housingId, string imageUrl, string publicId, bool isPrimary = false)
        {
            var img = new HousingImage
            {
                HousingId = housingId,
                ImageUrl = imageUrl,
                PublicId = publicId,
                IsPrimary = isPrimary,
                CreatedAt = DateTime.UtcNow
            };
            await _context.HousingImages.AddAsync(img);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteHousingImageAsync(int imageId)
        {
            var img = await _context.HousingImages.FindAsync(imageId);
            if (img == null) return false;
            _context.HousingImages.Remove(img);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<HousingListItemDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var h = await _context.Housings.AsNoTracking()
                .FirstOrDefaultAsync(x => x.HousingId == id, cancellationToken);
            if (h == null) return null;
            return new HousingListItemDto
            {
                Id = h.HousingId,
                Title = h.Title,
                Price = h.Price,
                DistanceKm = 0,
                Rating = 0,
                IsVerified = h.IsVerified,
                City = h.City
            };
        }

        public async Task<PagedResultDto<HousingListItemDto>> GetNearbyAsync(int universityId, double radiusKm, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var uni = await _context.Universities.AsNoTracking().FirstOrDefaultAsync(u => u.UniversityId == universityId, cancellationToken);
            if (uni == null)
            {
                return new PagedResultDto<HousingListItemDto> { Items = Enumerable.Empty<HousingListItemDto>(), Page = page, PageSize = pageSize, TotalCount = 0 };
            }

            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 20;

            // bounding box to reduce candidates
            var lat = uni.Latitude;
            var lon = uni.Longitude;
            var latDegree = radiusKm / 111.0; // approx degrees per km
            var lonDegree = radiusKm / (111.320 * Math.Cos(lat * Math.PI / 180.0));

            var minLat = lat - latDegree;
            var maxLat = lat + latDegree;
            var minLon = lon - lonDegree;
            var maxLon = lon + lonDegree;

            var query = _context.Housings.AsNoTracking()
                .Where(h => h.IsAvailable && h.Latitude >= minLat && h.Latitude <= maxLat && h.Longitude >= minLon && h.Longitude <= maxLon)
                .Select(h => new { h.HousingId, h.Title, h.Price, h.Latitude, h.Longitude, h.IsVerified, h.City });

            var list = await query.ToListAsync(cancellationToken);

            // load average ratings for all candidate housings in one query to avoid N+1
            var housingIds = list.Select(i => i.HousingId).ToList();
            var ratings = await _context.HousingReviews
                .Where(r => housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new { HousingId = g.Key, Avg = g.Average(x => x.Rating) })
                .ToListAsync(cancellationToken);

            var withDistance = list.Select(item => new HousingListItemDto
            {
                Id = item.HousingId,
                Title = item.Title,
                Price = item.Price,
                DistanceKm = _distanceCalculator.CalculateDistanceKm(lat, lon, item.Latitude, item.Longitude),
                Rating = ratings.FirstOrDefault(r => r.HousingId == item.HousingId)?.Avg ?? 0,
                IsVerified = item.IsVerified,
                City = item.City
            })
            .Where(h => h.DistanceKm <= radiusKm)
            .OrderBy(h => h.DistanceKm)
            .ToList();

            var total = withDistance.Count;
            var items = withDistance.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            return new PagedResultDto<HousingListItemDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }
    }
}
