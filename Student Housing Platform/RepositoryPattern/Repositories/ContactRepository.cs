using Student_Housing_Platform.Dtos.ContactDtos;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class ContactRepository : IContactRepository
    {
        private readonly SHP_DbContext _context;

        public ContactRepository(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateAsync(CreateContactMessageDto dto, string? userId)
        {
            var entity = new ContactMessage
            {
                Name = dto.Name.Trim(),
                Email = dto.Email.Trim(),
                Phone = dto.Phone,
                Subject = dto.Subject,
                Message = dto.Message.Trim(),
                UserId = userId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.ContactMessages.Add(entity);
            await _context.SaveChangesAsync();
            return entity.Id;
        }

        public async Task<IEnumerable<ContactMessageDto>> GetAllAsync()
        {
            return await _context.ContactMessages
                .AsNoTracking()
                .OrderByDescending(m => m.CreatedAt)
                .Select(m => new ContactMessageDto
                {
                    Id = m.Id,
                    Name = m.Name,
                    Email = m.Email,
                    Phone = m.Phone,
                    Subject = m.Subject,
                    Message = m.Message,
                    IsRead = m.IsRead,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var entity = await _context.ContactMessages.FindAsync(id);
            if (entity == null) return false;

            entity.IsRead = true;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
