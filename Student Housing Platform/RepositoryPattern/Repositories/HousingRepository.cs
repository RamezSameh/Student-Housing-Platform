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

        public HousingRepository(
            SHP_DbContext context,
            IDistanceCalculator distanceCalculator)
        {
            _context = context;
            _distanceCalculator = distanceCalculator;
        }

        // =========================================================
        // Get Owner Id
        // =========================================================

        public async Task<string?> GetOwnerIdAsync(int housingId)
        {
            var housing = await _context.Housings
                .AsNoTracking()
                .FirstOrDefaultAsync(h => h.HousingId == housingId);

            return housing?.OwnerId;
        }

        // =========================================================
        // Get Image By Id
        // =========================================================

        public async Task<HousingImage?> GetImageByIdAsync(int imageId)
        {
            return await _context.HousingImages
                .FindAsync(imageId);
        }

        // =========================================================
        // Search Housing
        // =========================================================

        public async Task<PagedResultDto<HousingListItemDto>> SearchAsync(
            int? universityId = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            double? maxDistance = null,
            string? housingTypeName = null,
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
            // -----------------------------------------------------
            // Validate pagination
            // -----------------------------------------------------

            if (page <= 0)
                page = 1;

            if (pageSize <= 0)
                pageSize = 20;

            // -----------------------------------------------------
            // Get University Coordinates
            // -----------------------------------------------------

            double? universityLatitude = null;
            double? universityLongitude = null;

            if (universityId.HasValue)
            {
                var university = await _context.Universities
                    .AsNoTracking()
                    .FirstOrDefaultAsync(
                        u => u.UniversityId == universityId.Value,
                        cancellationToken);

                if (university == null)
                {
                    return new PagedResultDto<HousingListItemDto>
                    {
                        Items = Enumerable.Empty<HousingListItemDto>(),
                        Page = page,
                        PageSize = pageSize,
                        TotalCount = 0
                    };
                }

                universityLatitude = university.Latitude;
                universityLongitude = university.Longitude;
            }

            // -----------------------------------------------------
            // Base Housing Query
            // -----------------------------------------------------

            var query = _context.Housings
                .AsNoTracking()
                .Where(h => h.IsAvailable);

            // -----------------------------------------------------
            // Price Filters
            // -----------------------------------------------------

            if (minPrice.HasValue)
            {
                query = query.Where(h =>
                    h.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(h =>
                    h.Price <= maxPrice.Value);
            }

            // -----------------------------------------------------
            // Housing Type
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(housingTypeName))
            {
                query = query.Where(h =>
                    h.HousingType.HousingTypeName == housingTypeName);
            }

            // -----------------------------------------------------
            // Gender
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(genderType))
            {
                query = query.Where(h =>
                    h.GenderType == genderType);
            }

            // -----------------------------------------------------
            // Furnished
            // -----------------------------------------------------

            if (isFurnished.HasValue)
            {
                query = query.Where(h =>
                    h.IsFurnished == isFurnished.Value);
            }

            // -----------------------------------------------------
            // Room Type
            // -----------------------------------------------------

            if (!string.IsNullOrWhiteSpace(roomType))
            {
                query = query.Where(h =>
                    h.Rooms != null &&
                    h.Rooms.Any(r =>
                        r.RoomType == roomType));
            }

            // -----------------------------------------------------
            // Amenities
            // -----------------------------------------------------

            if (amenities != null && amenities.Any())
            {
                foreach (var amenityId in amenities)
                {
                    var currentAmenityId = amenityId;

                    query = query.Where(h =>
                        h.HousingAmenities != null &&
                        h.HousingAmenities.Any(
                            ha => ha.AmenityId == currentAmenityId));
                }
            }

            // -----------------------------------------------------
            // Bounding Box
            //
            // Used only when:
            // university + maxDistance are available.
            // This reduces the number of candidate housings.
            // -----------------------------------------------------

            if (
                universityLatitude.HasValue &&
                universityLongitude.HasValue &&
                maxDistance.HasValue)
            {
                var latitude = universityLatitude.Value;
                var longitude = universityLongitude.Value;

                var latitudeDegree =
                    maxDistance.Value / 111.0;

                var longitudeDegree =
                    maxDistance.Value /
                    (111.320 *
                     Math.Cos(latitude * Math.PI / 180.0));

                var minLatitude =
                    latitude - latitudeDegree;

                var maxLatitude =
                    latitude + latitudeDegree;

                var minLongitude =
                    longitude - longitudeDegree;

                var maxLongitude =
                    longitude + longitudeDegree;

                query = query.Where(h =>
                    h.Latitude >= minLatitude &&
                    h.Latitude <= maxLatitude &&
                    h.Longitude >= minLongitude &&
                    h.Longitude <= maxLongitude);
            }

            // -----------------------------------------------------
            // Get Candidates
            // -----------------------------------------------------

            var candidates = await query
                .Select(h => new
                {
                    h.HousingId,
                    h.Title,
                    h.Price,
                    h.Latitude,
                    h.Longitude,
                    h.IsVerified,
                    h.City,
                    h.IsFurnished,
                    HousingTypeName =
                        h.HousingType.HousingTypeName
                })
                .ToListAsync(cancellationToken);

            // -----------------------------------------------------
            // Get Ratings
            // -----------------------------------------------------

            var housingIds = candidates
                .Select(h => h.HousingId)
                .ToList();

            var ratings = new List<dynamic>();

            if (housingIds.Any())
            {
                ratings = await _context.HousingReviews
                    .Where(r =>
                        housingIds.Contains(r.HousingId))
                    .GroupBy(r => r.HousingId)
                    .Select(g => new
                    {
                        HousingId = g.Key,
                        Avg = g.Average(x => x.Rating)
                    })
                    .Cast<dynamic>()
                    .ToListAsync(cancellationToken);
            }

            // -----------------------------------------------------
            // Map Results
            // -----------------------------------------------------

            var results = candidates
                .Select(item =>
                {
                    double distance = 0;

                    if (
                        universityLatitude.HasValue &&
                        universityLongitude.HasValue)
                    {
                        distance =
                            _distanceCalculator
                                .CalculateDistanceKm(
                                    universityLatitude.Value,
                                    universityLongitude.Value,
                                    item.Latitude,
                                    item.Longitude);
                    }

                    var rating =
                        ratings
                            .FirstOrDefault(
                                r => r.HousingId == item.HousingId)
                            ?.Avg ?? 0;

                    return new HousingListItemDto
                    {
                        Id = item.HousingId,
                        Title = item.Title,
                        Price = item.Price,
                        DistanceKm = distance,
                        Rating = rating,
                        IsVerified = item.IsVerified,
                        City = item.City
                    };
                })
                .ToList();

            // -----------------------------------------------------
            // Maximum Distance Filter
            // -----------------------------------------------------

            if (
                maxDistance.HasValue &&
                universityLatitude.HasValue &&
                universityLongitude.HasValue)
            {
                results = results
                    .Where(h =>
                        h.DistanceKm <= maxDistance.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // Minimum Rating
            // -----------------------------------------------------

            if (minimumRating.HasValue)
            {
                results = results
                    .Where(h =>
                        h.Rating >= minimumRating.Value)
                    .ToList();
            }

            // -----------------------------------------------------
            // Sorting
            // -----------------------------------------------------

            sortBy =
                sortBy?.ToLowerInvariant() ?? "distance";

            sortDirection =
                sortDirection?.ToLowerInvariant() ?? "asc";

            results = (sortBy, sortDirection) switch
            {
                // Price
                ("price", "asc") =>
                    results
                        .OrderBy(h => h.Price)
                        .ToList(),

                ("price", "desc") =>
                    results
                        .OrderByDescending(h => h.Price)
                        .ToList(),

                // Rating
                ("rating", "asc") =>
                    results
                        .OrderBy(h => h.Rating)
                        .ToList(),

                ("rating", "desc") =>
                    results
                        .OrderByDescending(h => h.Rating)
                        .ToList(),

                // Distance
                ("distance", "asc") =>
                    results
                        .OrderBy(h => h.DistanceKm)
                        .ToList(),

                ("distance", "desc") =>
                    results
                        .OrderByDescending(h => h.DistanceKm)
                        .ToList(),

                // Newest
                ("newest", _) =>
                    results
                        .OrderByDescending(h => h.Id)
                        .ToList(),

                // Default
                _ =>
                    results
                        .OrderBy(h => h.DistanceKm)
                        .ToList()
            };

            // -----------------------------------------------------
            // Pagination
            // -----------------------------------------------------

            var totalCount = results.Count;

            var items = results
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // -----------------------------------------------------
            // Return
            // -----------------------------------------------------

            return new PagedResultDto<HousingListItemDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }

        // =========================================================
        // Get By Ids
        // =========================================================

        public async Task<IEnumerable<HousingListItemDto>> GetByIdsAsync(
            IEnumerable<int> ids,
            CancellationToken cancellationToken = default)
        {
            var idList = ids.ToList();

            var list = await _context.Housings
                .AsNoTracking()
                .Where(h =>
                    idList.Contains(h.HousingId))
                .Select(h => new
                {
                    h.HousingId,
                    h.Title,
                    h.Price,
                    h.Latitude,
                    h.Longitude,
                    h.IsVerified,
                    h.City
                })
                .ToListAsync(cancellationToken);

            var housingIds = list
                .Select(h => h.HousingId)
                .ToList();

            var ratings = await _context.HousingReviews
                .Where(r =>
                    housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new
                {
                    HousingId = g.Key,
                    Avg = g.Average(x => x.Rating)
                })
                .ToListAsync(cancellationToken);

            return list
                .Select(item => new HousingListItemDto
                {
                    Id = item.HousingId,
                    Title = item.Title,
                    Price = item.Price,
                    DistanceKm = 0,
                    Rating =
                        ratings
                            .FirstOrDefault(
                                r => r.HousingId == item.HousingId)
                            ?.Avg ?? 0,
                    IsVerified = item.IsVerified,
                    City = item.City
                })
                .ToList();
        }

        // =========================================================
        // Compare Housing
        // =========================================================

        public async Task<IEnumerable<CompareHousingDto>> GetCompareByIdsAsync(
            IEnumerable<int> ids,
            CancellationToken cancellationToken = default)
        {
            var idList = ids.ToList();

            var list = await _context.Housings
                .AsNoTracking()
                .Where(h =>
                    idList.Contains(h.HousingId))
                .Select(h => new
                {
                    h.HousingId,
                    h.Title,
                    h.Price,
                    h.Latitude,
                    h.Longitude,
                    h.IsVerified,
                    h.City,
                    h.IsFurnished,
                    h.IsAvailable
                })
                .ToListAsync(cancellationToken);

            var housingIds = list
                .Select(h => h.HousingId)
                .ToList();

            var ratings = await _context.HousingReviews
                .Where(r =>
                    housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new
                {
                    HousingId = g.Key,
                    Avg = g.Average(x => x.Rating)
                })
                .ToListAsync(cancellationToken);

            return list
                .Select(item => new CompareHousingDto
                {
                    Id = item.HousingId,
                    Title = item.Title,
                    Price = item.Price,
                    DistanceKm = 0,
                    Rating =
                        ratings
                            .FirstOrDefault(
                                r => r.HousingId == item.HousingId)
                            ?.Avg ?? 0,
                    HousingTypes = string.Empty,
                    Amenities = string.Empty,
                    IsFurnished = item.IsFurnished,
                    IsAvailable = item.IsAvailable
                })
                .ToList();
        }

        // =========================================================
        // Create Housing
        // =========================================================

        public async Task<int> CreateAsync(
            CreateHousingDto dto,
            string ownerId,
            CancellationToken cancellationToken = default)
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
                HousingTypeId = dto.HousingTypeId,
                GenderType = dto.GenderType,
                IsFurnished = dto.IsFurnished,
                IsAvailable = dto.IsAvailable,
                OwnerId = ownerId,
                CreatedAt = DateTime.UtcNow,

                Location =
                    new NetTopologySuite.Geometries.Point(
                        dto.Longitude,
                        dto.Latitude)
                    {
                        SRID = 4326
                    }
            };

            await _context.Housings
                .AddAsync(entity, cancellationToken);

            await _context.SaveChangesAsync(
                cancellationToken);

            return entity.HousingId;
        }

        // =========================================================
        // Update Housing
        // =========================================================

        public async Task<bool> UpdateAsync(
            int id,
            UpdateHousingDto dto,
            string userId)
        {
            var entity = await _context.Housings
                .FindAsync(id);

            if (entity == null)
                return false;

            // Only owner can update.
            // Admin authorization is handled in Controller,
            // but repository still checks ownership.
            if (entity.OwnerId != userId)
                return false;

            entity.Title = dto.Title.Trim();
            entity.Description = dto.Description;
            entity.Address = dto.Address.Trim();
            entity.City = dto.City.Trim();
            entity.Latitude = dto.Latitude;
            entity.Longitude = dto.Longitude;
            entity.Price = dto.Price;
            entity.HousingTypeId = dto.HousingTypeId;
            entity.GenderType = dto.GenderType;
            entity.IsFurnished = dto.IsFurnished;
            entity.IsAvailable = dto.IsAvailable;
            entity.IsVerified = dto.IsVerified;
            entity.UpdatedAt = DateTime.UtcNow;

            entity.Location =
                new NetTopologySuite.Geometries.Point(
                    dto.Longitude,
                    dto.Latitude)
                {
                    SRID = 4326
                };

            _context.Housings.Update(entity);

            await _context.SaveChangesAsync();

            return true;
        }

        // =========================================================
        // Delete Housing
        // =========================================================

        public async Task<bool> DeleteAsync(
            int id,
            string userId)
        {
            var entity = await _context.Housings
                .FindAsync(id);

            if (entity == null)
                return false;

            if (entity.OwnerId != userId)
                return false;

            _context.Housings.Remove(entity);

            await _context.SaveChangesAsync();

            return true;
        }

        // =========================================================
        // Add Housing Image
        // =========================================================

        public async Task AddHousingImageAsync(
            int housingId,
            string imageUrl,
            string publicId,
            bool isPrimary = false)
        {
            // If this image is primary,
            // remove primary status from old images.
            if (isPrimary)
            {
                var oldPrimaryImages =
                    await _context.HousingImages
                        .Where(i =>
                            i.HousingId == housingId &&
                            i.IsPrimary)
                        .ToListAsync();

                foreach (var image in oldPrimaryImages)
                {
                    image.IsPrimary = false;
                }
            }

            var img = new HousingImage
            {
                HousingId = housingId,
                ImageUrl = imageUrl,
                PublicId = publicId,
                IsPrimary = isPrimary,
                CreatedAt = DateTime.UtcNow
            };

            await _context.HousingImages
                .AddAsync(img);

            await _context.SaveChangesAsync();
        }

        // =========================================================
        // Delete Housing Image
        // =========================================================

        public async Task<bool> DeleteHousingImageAsync(
            int imageId)
        {
            var img = await _context.HousingImages
                .FindAsync(imageId);

            if (img == null)
                return false;

            _context.HousingImages.Remove(img);

            await _context.SaveChangesAsync();

            return true;
        }

        // =========================================================
        // Get Housing By Id
        // =========================================================

        public async Task<HousingListItemDto?> GetByIdAsync(
            int id,
            CancellationToken cancellationToken = default)
        {
            var housing = await _context.Housings
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    h => h.HousingId == id,
                    cancellationToken);

            if (housing == null)
                return null;

            var rating = await _context.HousingReviews
                .Where(r => r.HousingId == id)
                .Select(r => (double?)r.Rating)
                .AverageAsync(cancellationToken)
                ?? 0;

            var rooms = await _context.HousingRooms
                .AsNoTracking()
                .Where(r => r.HousingId == id)
                .OrderByDescending(r => r.IsAvailable && r.AvailableBeds > 0)
                .ThenBy(r => r.Price)
                .Select(r => new HousingRoomDto
                {
                    HousingRoomId = r.RoomId,
                    RoomType = r.RoomType,
                    Capacity = r.Capacity,
                    AvailableBeds = r.AvailableBeds,
                    Price = r.Price,
                    IsAvailable = r.IsAvailable
                })
                .ToListAsync(cancellationToken);

            return new HousingListItemDto
            {
                Id = housing.HousingId,
                Title = housing.Title,
                Price = housing.Price,
                DistanceKm = 0,
                Rating = rating,
                IsVerified = housing.IsVerified,
                City = housing.City,
                Rooms = rooms
            };
        }

        // =========================================================
        // Get Nearby Housing
        // =========================================================

        public async Task<PagedResultDto<HousingListItemDto>> GetNearbyAsync(
            int universityId,
            double radiusKm,
            int page,
            int pageSize,
            CancellationToken cancellationToken = default)
        {
            var university = await _context.Universities
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    u => u.UniversityId == universityId,
                    cancellationToken);

            if (university == null)
            {
                return new PagedResultDto<HousingListItemDto>
                {
                    Items =
                        Enumerable.Empty<HousingListItemDto>(),
                    Page = page,
                    PageSize = pageSize,
                    TotalCount = 0
                };
            }

            if (page <= 0)
                page = 1;

            if (pageSize <= 0)
                pageSize = 20;

            if (radiusKm <= 0)
                radiusKm = 2;

            var latitude = university.Latitude;
            var longitude = university.Longitude;

            // -----------------------------------------------------
            // Bounding Box
            // -----------------------------------------------------

            var latitudeDegree =
                radiusKm / 111.0;

            var longitudeDegree =
                radiusKm /
                (111.320 *
                 Math.Cos(latitude *
                          Math.PI /
                          180.0));

            var minLatitude =
                latitude - latitudeDegree;

            var maxLatitude =
                latitude + latitudeDegree;

            var minLongitude =
                longitude - longitudeDegree;

            var maxLongitude =
                longitude + longitudeDegree;

            // -----------------------------------------------------
            // Get Candidates
            // -----------------------------------------------------

            var query = _context.Housings
                .AsNoTracking()
                .Where(h =>
                    h.IsAvailable &&
                    h.Latitude >= minLatitude &&
                    h.Latitude <= maxLatitude &&
                    h.Longitude >= minLongitude &&
                    h.Longitude <= maxLongitude)
                .Select(h => new
                {
                    h.HousingId,
                    h.Title,
                    h.Price,
                    h.Latitude,
                    h.Longitude,
                    h.IsVerified,
                    h.City
                });

            var list = await query
                .ToListAsync(cancellationToken);

            // -----------------------------------------------------
            // Ratings
            // -----------------------------------------------------

            var housingIds = list
                .Select(h => h.HousingId)
                .ToList();

            var ratings = await _context.HousingReviews
                .Where(r =>
                    housingIds.Contains(r.HousingId))
                .GroupBy(r => r.HousingId)
                .Select(g => new
                {
                    HousingId = g.Key,
                    Avg = g.Average(x => x.Rating)
                })
                .ToListAsync(cancellationToken);

            // -----------------------------------------------------
            // Calculate Distance
            // -----------------------------------------------------

            var withDistance = list
                .Select(item => new HousingListItemDto
                {
                    Id = item.HousingId,
                    Title = item.Title,
                    Price = item.Price,

                    DistanceKm =
                        _distanceCalculator
                            .CalculateDistanceKm(
                                latitude,
                                longitude,
                                item.Latitude,
                                item.Longitude),

                    Rating =
                        ratings
                            .FirstOrDefault(
                                r => r.HousingId ==
                                     item.HousingId)
                            ?.Avg ?? 0,

                    IsVerified = item.IsVerified,
                    City = item.City
                })
                .Where(h =>
                    h.DistanceKm <= radiusKm)
                .OrderBy(h =>
                    h.DistanceKm)
                .ToList();

            // -----------------------------------------------------
            // Pagination
            // -----------------------------------------------------

            var totalCount =
                withDistance.Count;

            var items = withDistance
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return new PagedResultDto<HousingListItemDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount
            };
        }
    }
}