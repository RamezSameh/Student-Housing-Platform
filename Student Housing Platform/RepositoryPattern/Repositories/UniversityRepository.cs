using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.UniversityDtos;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class UniversityRepository : IUniversityRepository
    {
        private readonly SHP_DbContext _context;

        public UniversityRepository(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<PagedResultDto<UniversityDto>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default)
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0) pageSize = 20;

            var query = _context.Universities.AsNoTracking().OrderBy(u => u.Name);
            var total = await query.CountAsync(cancellationToken);
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UniversityDto
                {
                    UniversityId = u.UniversityId,
                    Name = u.Name,
                    Description = u.Description,
                    Address = u.Address,
                    City = u.City,
                    Latitude = u.Latitude,
                    Longitude = u.Longitude,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync(cancellationToken);

            return new PagedResultDto<UniversityDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalCount = total
            };
        }

        public async Task<UniversityDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var u = await _context.Universities.AsNoTracking().FirstOrDefaultAsync(x => x.UniversityId == id, cancellationToken);
            if (u == null) return null;
            return new UniversityDto
            {
                UniversityId = u.UniversityId,
                Name = u.Name,
                Description = u.Description,
                Address = u.Address,
                City = u.City,
                Latitude = u.Latitude,
                Longitude = u.Longitude,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            };
        }

        public async Task<UniversityDto> CreateAsync(CreateUniversityDto dto, CancellationToken cancellationToken = default)
        {
            var entity = new University
            {
                Name = dto.Name.Trim(),
                Description = dto.Description,
                Address = dto.Address.Trim(),
                City = dto.City.Trim(),
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Universities.AddAsync(entity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return new UniversityDto
            {
                UniversityId = entity.UniversityId,
                Name = entity.Name,
                Description = entity.Description,
                Address = entity.Address,
                City = entity.City,
                Latitude = entity.Latitude,
                Longitude = entity.Longitude,
                IsActive = entity.IsActive,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateUniversityDto dto, CancellationToken cancellationToken = default)
        {
            var entity = await _context.Universities.FindAsync(new object[] { id }, cancellationToken);
            if (entity == null) return false;

            entity.Name = dto.Name.Trim();
            entity.Description = dto.Description;
            entity.Address = dto.Address.Trim();
            entity.City = dto.City.Trim();
            entity.Latitude = dto.Latitude;
            entity.Longitude = dto.Longitude;
            entity.IsActive = dto.IsActive;

            _context.Universities.Update(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var entity = await _context.Universities.FindAsync(new object[] { id }, cancellationToken);
            if (entity == null) return false;

            _context.Universities.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
