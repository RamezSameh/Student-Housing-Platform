using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using System.Security.Claims;

namespace Student_Housing_Platform.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ConversationsController : ControllerBase
    {
        private readonly IMessageRepository _repo;
        public ConversationsController(IMessageRepository repo)
        {
            _repo = repo;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Models.Conversation conv)
        {
            var created = await _repo.CreateConversationAsync(conv);
            return CreatedAtAction(nameof(GetMessages), new { id = created.ConversationId }, created);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyConversations()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var convs = await _repo.GetConversationsForUserAsync(userId);
            return Ok(convs);
        }

        [HttpGet("{id:int}/messages")]
        public async Task<IActionResult> GetMessages(int id)
        {
            var msgs = await _repo.GetMessagesByConversationIdAsync(id);
            return Ok(msgs);
        }
    }
}
