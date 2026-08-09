using Student_Housing_Platform.Models;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IMessageRepository
    {
        Task<Message> SaveMessageAsync(Message message);
        Task<IEnumerable<Message>> GetMessagesByConversationIdAsync(int conversationId);
        Task<Conversation> CreateConversationAsync(Conversation conversation);
        Task<IEnumerable<Conversation>> GetConversationsForUserAsync(string userId);
    }
}
