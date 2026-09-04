using Student_Housing_Platform.Dtos.ContactDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IContactRepository
    {
        Task<int> CreateAsync(CreateContactMessageDto dto, string? userId);
        Task<IEnumerable<ContactMessageDto>> GetAllAsync();
        Task<bool> MarkAsReadAsync(int id);
    }
}
