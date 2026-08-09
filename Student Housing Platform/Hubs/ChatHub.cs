using Microsoft.AspNetCore.SignalR;

using Student_Housing_Platform.RepositoryPattern.Interfaces;
using Student_Housing_Platform.Models;

namespace Student_Housing_Platform.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IMessageRepository _messageRepo;

        public ChatHub(IMessageRepository messageRepo)
        {
            _messageRepo = messageRepo;
        }

        public async Task SendMessageToConversation(int conversationId, string senderId, string message)
        {
            var msg = new Message
            {
                ConversationId = conversationId,
                SenderId = senderId,
                Content = message,
                SentAt = DateTime.UtcNow
            };
            await _messageRepo.SaveMessageAsync(msg);

            var payload = new { ConversationId = conversationId, SenderId = senderId, Message = message, SentAt = msg.SentAt };
            await Clients.Group(conversationId.ToString()).SendAsync("ReceiveMessage", payload);
        }

        public Task JoinConversation(int conversationId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public Task LeaveConversation(int conversationId)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        }
    }
}
