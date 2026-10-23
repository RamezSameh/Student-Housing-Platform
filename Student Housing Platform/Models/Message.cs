using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Student_Housing_Platform.Models
{
    public class Message
    {
        [Key]
        public int MessageId { get; set; }
        [Required]
        public int ConversationId { get; set; }
        [ForeignKey("ConversationId")]
        public Conversation Conversation { get; set; } = null!;
        [Required]
        public string SenderId { get; set; } = string.Empty;
        [ForeignKey("SenderId")]
        public ApplicationUser Sender { get; set; } = null!;
        [Required]
        public string Content { get; set; } = string.Empty;
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
