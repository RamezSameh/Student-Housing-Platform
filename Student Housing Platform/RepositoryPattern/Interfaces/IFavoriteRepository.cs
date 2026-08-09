using Student_Housing_Platform.Dtos.FavoriteDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IFavoriteRepository
    {
        Task<bool> AddFavoriteAsync(string userId, int housingId);
        Task<bool> RemoveFavoriteAsync(string userId, int housingId);
        Task<IEnumerable<FavoriteDto>> GetUserFavoritesAsync(string userId);
        Task<bool> IsFavoritedAsync(string userId, int housingId);
    }
}
