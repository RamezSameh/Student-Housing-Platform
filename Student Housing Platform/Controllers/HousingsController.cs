using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.HousingDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using System.Security.Claims;
using Student_Housing_Platform.Services.CloudinaryService;

namespace Student_Housing_Platform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HousingsController : ControllerBase
    {
        private readonly IHousingRepository _repo;
        private readonly Student_Housing_Platform.Services.Recommendation.IRecommendationService _recommendationService;
        private readonly ICloudinaryService _cloudinary;

        public HousingsController(IHousingRepository repo, Student_Housing_Platform.Services.Recommendation.IRecommendationService recommendationService)
        {
            _repo = repo;
            _recommendationService = recommendationService;
        }

        // GET: /api/housings/nearby?universityId=1&radius=2&page=1&pageSize=20
        [HttpGet("nearby")]
        public async Task<IActionResult> GetNearby([FromQuery] int universityId, [FromQuery] double radius = 2, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _repo.GetNearbyAsync(universityId, radius, page, pageSize);
            var response = new Dtos.Common.ApiResponse<object>
            {
                Success = true,
                Data = new { items = result.Items, page = result.Page, pageSize = result.PageSize, totalCount = result.TotalCount, totalPages = result.TotalPages }
            };
            return Ok(response);
        }

        // GET: /api/housings/compare?ids=1,2,3
        [HttpGet("compare")]
        public async Task<IActionResult> Compare([FromQuery] string ids)
        {
            if (string.IsNullOrWhiteSpace(ids)) return BadRequest("ids required");
            var idList = ids.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => int.TryParse(s, out var id) ? id : 0).Where(i => i > 0).ToList();
            if (!idList.Any()) return BadRequest("invalid ids");
            var items = await _repo.GetCompareByIdsAsync(idList);
            var response = new Dtos.Common.ApiResponse<object> { Success = true, Data = items };
            return Ok(response);
        }

        // GET: /api/housings/recommended
        [HttpGet("recommended")]
        public async Task<IActionResult> Recommended(
            [FromQuery] int? universityId,
            [FromQuery] decimal? maxBudget,
            [FromQuery] double? maxDistance,
            [FromQuery] string? roomType,
            [FromQuery] string? genderPreference,
            [FromQuery] string? amenities,
            [FromQuery] double? minimumRating,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            List<int>? amenityIds = null;
            if (!string.IsNullOrEmpty(amenities))
            {
                amenityIds = amenities.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => int.TryParse(s, out var id) ? id : 0).Where(i => i > 0).ToList();
            }

            var result = await _recommendationService.RecommendAsync(universityId, maxBudget, maxDistance, roomType, genderPreference, amenityIds, minimumRating, page, pageSize);

            var response = new
            {
                items = result.Items,
                page = result.Page,
                pageSize = result.PageSize,
                totalCount = result.TotalCount,
                totalPages = result.TotalPages
            };
            return Ok(response);
        }

        // GET: /api/housings/search
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] int? universityId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] double? maxDistance,
            [FromQuery] string? housingType,
            [FromQuery] string? roomType,
            [FromQuery] string? genderType,
            [FromQuery] bool? isFurnished,
            [FromQuery] string? amenities,
            [FromQuery] double? minimumRating,
            [FromQuery] string? sortBy,
            [FromQuery] string? sortDirection,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            List<int>? amenityIds = null;
            if (!string.IsNullOrEmpty(amenities))
            {
                amenityIds = amenities.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => int.TryParse(s, out var id) ? id : 0).Where(i => i > 0).ToList();
            }

            var result = await _repo.SearchAsync(universityId, minPrice, maxPrice, maxDistance, housingType, roomType, genderType, isFurnished, amenityIds, minimumRating, sortBy, sortDirection, page, pageSize);

            var response = new
            {
                items = result.Items,
                page = result.Page,
                pageSize = result.PageSize,
                totalCount = result.TotalCount,
                totalPages = result.TotalPages
            };
            return Ok(response);
        }

        // GET: /api/housings
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            // temporary: reuse nearby with a very large radius from first university if exists
            return BadRequest("Use /api/housings/nearby or implement listing.");
        }

        // GET: /api/housings/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _repo.GetByIdAsync(id);
            if (dto == null) return NotFound(new { success = false, message = "Housing not found" });
            return Ok(new { success = true, data = dto });
        }

        // POST: /api/housings
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateHousingDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var id = await _repo.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = id }, new { success = true, data = new { id } });
        }

        // POST: /api/housings/{id}/images
        [HttpPost("{id:int}/images")]
        [Authorize]
        public async Task<IActionResult> UploadImage(int id, IFormFile file, [FromForm] bool isPrimary = false)
        {
            if (file == null || file.Length == 0) return BadRequest("No file provided.");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Check ownership or admin
            var housing = await _repo.GetByIdAsync(id);
            if (housing == null) return NotFound();
            if (!User.IsInRole("Admin"))
            {
                var ownerId = await _repo.GetOwnerIdAsync(id);
                if (ownerId == null) return NotFound();
                if (ownerId != userId) return Forbid();
            }

            try
            {
                var (url, publicId) = await _cloudinary.UploadImageAsync(file, folder: $"housings/{id}");
                await _repo.AddHousingImageAsync(id, url, publicId, isPrimary);
                return Ok(new { url });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Image upload failed: " + ex.Message);
            }
        }

        // DELETE: /api/housings/images/{imageId}
        [HttpDelete("images/{imageId:int}")]
        [Authorize]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            // fetch image entity to get housing and owner
            var img = await _repo.GetImageByIdAsync(imageId);
            if (img == null) return NotFound();
            var housing = await _repo.GetOwnerIdAsync(img.HousingId);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            if (!User.IsInRole("Admin") && housing != userId) return Forbid();

            // delete from cloudinary if public id exists
            if (!string.IsNullOrEmpty(img.PublicId))
            {
                await _cloudinary.DeleteImageAsync(img.PublicId);
            }
            var deleted = await _repo.DeleteHousingImageAsync(imageId);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // PUT: /api/housings/{id}
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateHousingDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // allow admin to update any housing
            if (User.IsInRole("Admin"))
            {
                // fetch entity to get ownerId for repository check bypass
                var updated = await _repo.UpdateAsync(id, dto, userId);
                if (!updated) return NotFound(new { success = false, message = "Housing not found or update failed" });
                return NoContent();
            }

            var result = await _repo.UpdateAsync(id, dto, userId);
            if (!result) return Forbid();
            return NoContent();
        }

        // DELETE: /api/housings/{id}
        [HttpDelete("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            // Admin can delete any
            if (User.IsInRole("Admin"))
            {
                var deleted = await _repo.DeleteAsync(id, userId);
                if (!deleted) return NotFound();
                return NoContent();
            }

            var success = await _repo.DeleteAsync(id, userId);
            if (!success) return Forbid();
            return NoContent();
        }
    }
}
