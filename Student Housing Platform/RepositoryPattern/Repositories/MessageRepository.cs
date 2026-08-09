using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class MessageRepository : IMessageRepository
    {
        private readonly SHP_DbContext _context;
        public MessageRepository(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<Message> SaveMessageAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId)
        {
            return await _context.Messages.Where(m => m.ConversationId == conversationId).OrderBy(m => m.SentAt).ToListAsync();
        }

        public async Task<Conversation> CreateConversationAsync(Conversation conversation)
        {
            await _context.Conversations.AddAsync(conversation);
            await _context.SaveChangesAsync();
            return conversation;
        }

        public async Task<IEnumerable<Conversation>> GetConversationsForUserAsync(string userId)
        {
            // Simple: return all conversations that have messages from or to user; can be improved with participants table
            var convIds = await _context.Messages.Where(m => m.SenderId == userId).Select(m => m.ConversationId).Distinct().ToListAsync();
            return await _context.Conversations.Where(c => convIds.Contains(c.ConversationId)).ToListAsync();
        }
    }
}
