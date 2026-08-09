using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.Dtos.Common;
using Student_Housing_Platform.Dtos.UniversityDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UniversitiesController : ControllerBase
    {
        private readonly IUniversityRepository _repo;

        public UniversitiesController(IUniversityRepository repo)
        {
            _repo = repo;
        }

        // GET: /api/universities?page=1&pageSize=20
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken cancellationToken = default)
        {
            var result = await _repo.GetPagedAsync(page, pageSize, cancellationToken);

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

        // GET: /api/universities/5
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _repo.GetByIdAsync(id);
            if (dto == null) return NotFound(new Dtos.Common.ApiResponse<object> { Success = false, Message = "University not found" });
            return Ok(new Dtos.Common.ApiResponse<UniversityDto> { Success = true, Message = "University retrieved successfully", Data = dto });
        }

        // POST: /api/universities
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateUniversityDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _repo.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.UniversityId }, new { success = true, data = created });
        }

        // PUT: /api/universities/5
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUniversityDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updated = await _repo.UpdateAsync(id, dto);
            if (!updated) return NotFound(new { success = false, message = "University not found" });
            return NoContent();
        }

        // DELETE: /api/universities/5
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted) return NotFound(new { success = false, message = "University not found" });
            return NoContent();
        }
    }
}
