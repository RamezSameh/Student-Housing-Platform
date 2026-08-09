using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.Dtos.ReviewDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using System.Security.Claims;

namespace Student_Housing_Platform.Controllers
{
    [ApiController]
    [Route("api/housings/{housingId:int}/reviews")]
    public class HousingReviewsController : ControllerBase
    {
        private readonly IHousingReviewRepository _repo;

        public HousingReviewsController(IHousingReviewRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetByHousing(int housingId)
        {
            var reviews = await _repo.GetByHousingIdAsync(housingId);
            return Ok(reviews);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create(int housingId, [FromBody] CreateHousingReviewDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            if (dto.HousingId != housingId) return BadRequest("HousingId mismatch");
            var created = await _repo.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetByHousing), new { housingId = housingId }, created);
        }
    }
}
