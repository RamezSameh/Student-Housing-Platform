using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.Dtos.FavoriteDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using System.Security.Claims;

namespace Student_Housing_Platform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteRepository _repo;
        public FavoritesController(IFavoriteRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMyFavorites()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var favs = await _repo.GetUserFavoritesAsync(userId);
            return Ok(favs);
        }

        [HttpPost("{housingId:int}")]
        [Authorize]
        public async Task<IActionResult> AddFavorite(int housingId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var added = await _repo.AddFavoriteAsync(userId, housingId);
            if (!added) return Conflict("Already favorited");
            return Ok();
        }

        [HttpDelete("{housingId:int}")]
        [Authorize]
        public async Task<IActionResult> RemoveFavorite(int housingId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var removed = await _repo.RemoveFavoriteAsync(userId, housingId);
            if (!removed) return NotFound();
            return NoContent();
        }
    }
}
