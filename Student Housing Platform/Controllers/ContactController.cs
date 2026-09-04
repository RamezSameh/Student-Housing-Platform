using Student_Housing_Platform.Dtos.ContactDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ContactController : ControllerBase
    {
        private readonly IContactRepository _repo;

        public ContactController(IContactRepository repo)
        {
            _repo = repo;
        }

        // POST: api/Contact — public, no login required.
        [HttpPost]
        public async Task<IActionResult> Send([FromBody] CreateContactMessageDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // If the sender happens to be logged in, tag the message with
            // their account — but don't require it.
            var userId = User?.FindFirstValue(ClaimTypes.NameIdentifier);

            var id = await _repo.CreateAsync(dto, userId);
            return Ok(new { success = true, data = new { id } });
        }

        // GET: api/Contact — admin inbox.
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var messages = await _repo.GetAllAsync();
            return Ok(new { success = true, data = messages });
        }

        // PUT: api/Contact/{id}/read
        [HttpPut("{id:int}/read")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var updated = await _repo.MarkAsReadAsync(id);
            if (!updated) return NotFound();
            return NoContent();
        }
    }
}
