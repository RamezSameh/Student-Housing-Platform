using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.FavoriteDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly SHP_DbContext _context;
        public FavoriteRepository(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<bool> AddFavoriteAsync(string userId, int housingId)
        {
            var exists = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.HousingId == housingId);
            if (exists) return false;
            var fav = new Student_Housing_Platform.Models.Favorite { UserId = userId, HousingId = housingId, CreatedAt = DateTime.UtcNow };
            await _context.Favorites.AddAsync(fav);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemoveFavoriteAsync(string userId, int housingId)
        {
            var fav = await _context.Favorites.FindAsync(userId, housingId);
            if (fav == null) return false;
            _context.Favorites.Remove(fav);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<FavoriteDto>> GetUserFavoritesAsync(string userId)
        {
            return await _context.Favorites.Where(f => f.UserId == userId)
                .Select(f => new FavoriteDto { HousingId = f.HousingId, CreatedAt = f.CreatedAt })
                .ToListAsync();
        }

        public async Task<bool> IsFavoritedAsync(string userId, int housingId)
        {
            return await _context.Favorites.AnyAsync(f => f.UserId == userId && f.HousingId == housingId);
        }
    }
}
