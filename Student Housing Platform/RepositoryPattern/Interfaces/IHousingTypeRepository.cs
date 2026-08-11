using Student_Housing_Platform.Dtos.HousingTypeDtos;
using Student_Housing_Platform.Models;
using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Dtos.RoomTypeDtos;

namespace Student_Housing_Platform.RepositoryPattern.Interfaces
{
    public interface IHousingTypeRepository
    {
        // For admin settings
        Task <IEnumerable<HousingTypeDto>> GetAllHousingTypesAsync();
        Task<HousingTypeDto?> GetHousingTypeDtoByNameAsync(string housingTypeName);
        Task<HousingType> GetHousingTypeEntityByIdAsync(int housingTypeId);
        Task AddHousingTypeAsync(CreateHousingTypeDto housingTypeDto);
        Task UpdateHousingTypeAsync(int housingTypeId, CreateHousingTypeDto housingTypeDto);
        Task<bool> DeleteHousingTypeAsync(int housingTypeId);

    }
}
