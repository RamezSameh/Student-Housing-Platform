using Student_Housing_Platform.Dtos.RoomTypeDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IRoomTypeRepository
    {
        // For admin settings
        Task <IEnumerable<RoomTypeDto>> GetAllRoomTypesAsync();
        Task<RoomTypeDto?> GetRoomTypeDtoByIdAsync(int roomTypeId);
        Task<RoomType> GetRoomEntityByIdAsync(int roomTypeId);
        Task AddRoomTypeAsync(CreateRoomTypeDto roomTypeDto);
        Task UpdateRoomTypeAsync(int roomTypeId, CreateRoomTypeDto roomTypeDto);
        Task<bool> DeleteRoomTypeAsync(int roomTypeId);

    }
}
