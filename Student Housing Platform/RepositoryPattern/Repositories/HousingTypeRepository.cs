using Student_Housing_Platform.Dtos.HousingTypeDtos;
using Student_Housing_Platform.Dtos.RoomTypeDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class HousingTypeRepository : IHousingTypeRepository
    {
        private readonly SHP_DbContext _context;
        public HousingTypeRepository(SHP_DbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<HousingTypeDto>> GetAllHousingTypesAsync()
        {
           return await _context.HousingTypes.Select(rt => new HousingTypeDto
            {
                HousingTypeIdDto = rt.HousingTypeId,
                HousingTypeNameDto = rt.Name,
                HousingTypeDescriptionDto = rt.Description,
                HousingTypeCapacityDto = rt.Capacity,
                HousingTypePricePerMonthDto = rt.PricePerMonth
            }).ToListAsync();
        }
        public async Task<HousingTypeDto?> GetHousingTypeDtoByNameAsync(string housingTypeName)
        {
            return await _context.HousingTypes.Select(Rt=> new HousingTypeDto { 
                HousingTypeIdDto = Rt.HousingTypeId,
                HousingTypeNameDto = Rt.Name,
                HousingTypeDescriptionDto = Rt.Description,
                HousingTypeCapacityDto = Rt.Capacity,
                HousingTypePricePerMonthDto = Rt.PricePerMonth  
            }).FirstOrDefaultAsync(rtId => rtId.HousingTypeNameDto ==  housingTypeName);
        }
        public async Task<HousingType> GetHousingTypeEntityByIdAsync(int housingTypeId)
        {
            return await _context.HousingTypes.FindAsync(housingTypeId);
        }
        public async Task AddHousingTypeAsync(CreateHousingTypeDto housingTypeDto)
        {
            var newHousingType = new HousingType
            {
                Name = housingTypeDto.HousingTypeName,
                Description = housingTypeDto.Description,
                Capacity = housingTypeDto.Capacity,
                PricePerMonth = housingTypeDto.PricePerMonth,
            };
            await _context.HousingTypes.AddAsync(newHousingType);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateHousingTypeAsync(int housingTypeId, CreateHousingTypeDto housingTypeDto)
        {
            var HousingTypeUpdate = _context.HousingTypes.Find(housingTypeId);
            if (HousingTypeUpdate != null)
            {
                HousingTypeUpdate.Name = housingTypeDto.HousingTypeName;
                HousingTypeUpdate.Description = housingTypeDto.Description;
                HousingTypeUpdate.Capacity = housingTypeDto.Capacity;
                HousingTypeUpdate.PricePerMonth = housingTypeDto.PricePerMonth;
                _context.Entry(HousingTypeUpdate).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new KeyNotFoundException($"HousingType with ID {housingTypeId} not found.");
            }
        }

        public async Task<bool> DeleteHousingTypeAsync(int housingTypeId)
        {
            var HousingTypeExist = await _context.HousingTypes.FindAsync(housingTypeId);
            if(HousingTypeExist is null)
            {
                return false;
            }
            _context.HousingTypes.Remove(HousingTypeExist);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
