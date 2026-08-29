using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Student_Housing_Platform.Dtos.AccountDtos;
using Student_Housing_Platform.Dtos.HousingDtos;
using Student_Housing_Platform.Dtos.RoomTypeDtos;
using Student_Housing_Platform.RepositoryPattern.Interfaces;
using Student_Housing_Platform.RepositoryPattern.Repositories;
using Student_Housing_Platform.Services.CloudinaryService;
using static System.Net.Mime.MediaTypeNames;

namespace Student_Housing_Platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IHousingRepository _housingRepository;
        private readonly IHousingTypeRepository _housingTypeRepository;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<AdminController> _logger;
        public AdminController(IHousingTypeRepository housingTypeRepository, IHousingRepository housingRepository,
            ICloudinaryService cloudinaryService, UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager, ILogger<AdminController> logger, IBookingRepository bookingRepository)
        {
            _housingTypeRepository = housingTypeRepository;
            _housingRepository = housingRepository;
            _cloudinaryService = cloudinaryService;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
            _bookingRepository=bookingRepository;
        }
        [HttpPost("housing-types")] // POST: api/Admin/housing-types
        public async Task<IActionResult> AddHousingType([FromBody] CreateHousingTypeDto createHousingTypeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _housingTypeRepository.AddHousingTypeAsync(createHousingTypeDto);
            return Ok(new { Message = "Housing type added successfully." });
        }
        [HttpGet("housing-types")]
        public async Task<IActionResult> GetAllHousingTypes()
        {
            var housingTypes = await _housingTypeRepository.GetAllHousingTypesAsync();
            return Ok(housingTypes);

        }
        [HttpGet("housing-types/{name}")]
        public async Task<IActionResult> GetHousingTypeById(int id)
        {
            var housingType = await _housingTypeRepository.GetHousingTypeDtoByIdAsync(id);
            if (housingType == null)
            {
                return NotFound(new { Message = "Housing type not found." });
            }
            return Ok(housingType);
        }
        [HttpPut("housing-types/{id}")]
        public async Task<IActionResult> UpdateHousingType(int id, [FromBody] CreateHousingTypeDto createHousingTypeDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _housingTypeRepository.UpdateHousingTypeAsync(id, createHousingTypeDto);
            return Ok(new { Message = "Housing type updated successfully." });
        }
        [HttpDelete("housing-types/{id}")]
        public async Task<IActionResult> DeleteHousingType(int id)
        {
            var result = await _housingTypeRepository.DeleteHousingTypeAsync(id);
            if (!result)
            {
                return NotFound(new { Message = "Housing type not found." });
            }
            return Ok(new { Message = "Housing type deleted successfully." });
        }


        // Housing methods
        [HttpPost("housings")]
        public async Task<IActionResult> AddHousing([FromBody] CreateHousingDto housingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Get current logged-in user
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); if (string.IsNullOrEmpty(userId)) { return Unauthorized(new { Message = "User ID not found in token." }); }
            var housingType = await _housingTypeRepository.GetHousingTypeDtoByIdAsync(housingDto.HousingTypeId);
            if (housingType == null)
            {
                return BadRequest(new { Message = "Invalid HousingType. Housing type does not exist." });
            }
            // Get owner from database
            var owner = await _userManager.FindByIdAsync(userId); 
            if (owner == null) { 
                return Unauthorized(new { Message = "Owner not found." }); 
            }
            var newHousing = new CreateHousingDto
            {
                Title = housingDto.Title,
                Description = housingDto.Description,
                Address = housingDto.Address,
                City = housingDto.City,
                Latitude = housingDto.Latitude,
                Longitude = housingDto.Longitude,
                Price = housingDto.Price,
                HousingTypeId = housingDto.HousingTypeId,
                GenderType = housingDto.GenderType,
                IsFurnished = housingDto.IsFurnished,
                IsAvailable = housingDto.IsAvailable,
                OwnerId = owner.Id
            };
            await _housingRepository.CreateAsync(newHousing ,owner.Id);
            return Ok(new { Message = "Housing added successfully." });
        }
        [HttpPut("housings/{id}")]
        public async Task<IActionResult> UpdateHousing(int id, [FromBody] UpdateHousingDto updateHousingDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            // Get current logged-in user
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier); if (string.IsNullOrEmpty(userId)) { return Unauthorized(new { Message = "User ID not found in token." }); }

            var housingType = await _housingTypeRepository.GetHousingTypeDtoByIdAsync(updateHousingDto.HousingTypeId);
            if (housingType == null)
            {
                return BadRequest(new { Message = "Invalid HousingTypeId . Housing type does not exist." });
            }
            // Get owner from database
            var owner = await _userManager.FindByIdAsync(userId);
            if (owner == null)
            {
                return Unauthorized(new { Message = "Owner not found." });
            }
            await _housingRepository.UpdateAsync(id, updateHousingDto , owner.Id);
            return Ok(new { Message = "Housing updated successfully." });

        }
        [HttpDelete("housings/{id}")]
        public async Task<IActionResult> DeleteHousing(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token." });
            }

            var result = await _housingRepository.DeleteAsync(id, userId);
            if (!result)
            {
                return NotFound(new { Message = "Housing not found." });
            }
            return Ok(new { Message = "Housing deleted successfully." });
        }
        // Room Image methods
        [Authorize(Roles = "Admin")]
        [HttpPost("rooms/{roomId}/images")]
        public async Task<IActionResult> UploadRoomImage(int roomId, IFormFile imageFile)
        {
            if (imageFile == null) return BadRequest(new { Message = "Image file is required." });
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(imageFile.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new { Message = "Invalid image format. Only JPG and PNG are allowed." });
            }
            if (imageFile.Length > 5 * 1024 * 1024) // 5 MB limit
            {
                return BadRequest(new { Message = "Image size exceeds the 5MB limit." });
            }
            var room = await _housingRepository.GetByIdAsync(roomId);

            if (room == null) return NotFound(new { Message = "Housing not found." });
            var folder = $"rooms/{roomId}";
            var (url, publicId) = await _cloudinaryService.UploadImageAsync(imageFile, folder);
            var housingImage = new HousingImage
            {
                ImageUrl = url,
                PublicId = publicId,
                IsPrimary = room.IsVerified.Equals(true) // Set as primary if the room is not verified
            };
            await _housingRepository.AddHousingImageAsync(roomId, url , publicId , housingImage.IsPrimary);
            var dto = new HousingImage { Id = housingImage.Id, ImageUrl = housingImage.ImageUrl, IsPrimary = housingImage.IsPrimary };
            return Ok(dto);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("rooms/{roomId}/images/bulk")]
        public async Task<IActionResult> UploadRoomImagesBulk(int roomId, List<IFormFile> files)
        {
            if (files == null || !files.Any()) return BadRequest("No files provided.");
            var room = await _housingRepository.GetByIdAsync(roomId);
            if (room == null) return NotFound("Housing not found.");

            var results = new List<HousingImage>();
            var folder = $"bookify/rooms/{roomId}";

            foreach (var file in files)
            {
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
                var allowed = new[] { ".jpg", ".jpeg", ".png" };
                if (!allowed.Contains(ext)) continue; // skip invalid
                if (file.Length > 5 * 1024 * 1024) continue; // skip too big

                var (url, publicId) = await _cloudinaryService.UploadImageAsync(file, folder);
                var image = new HousingImage
                {
                    ImageUrl = url,
                    PublicId = publicId,
                    IsPrimary = (room.IsVerified == true) // Set as primary if the room is verified
                };
                await _housingRepository.AddHousingImageAsync(roomId, url , publicId , image.IsPrimary);
                results.Add(image);
            }

            return Ok(results);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("rooms/{roomId}/images/{imageId}")]
        public async Task<IActionResult> DeleteRoomImage(int roomId, int imageId)
        {
            var img = await _housingRepository.GetImageByIdAsync(imageId);
            if (img == null || img.HousingId != roomId) return NotFound();

            if (!string.IsNullOrEmpty(img.PublicId))
                await _cloudinaryService.DeleteImageAsync(img.PublicId);

            var ok = await _housingRepository.DeleteHousingImageAsync(imageId);
            if (!ok) return StatusCode(500, "Failed to delete image.");

            return Ok(new { Message = "Image deleted." });
        }

        //------------------------------admin user management-------------------------------
        [HttpGet("bookings")]
        public async Task<IActionResult> GetUserBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized("User ID not found in token.");
            }
            var bookings = await _bookingRepository.GetUserBookingsAsync(userId);

            // front end handling empty list is better
            //if (bookings == null || !bookings.Any())
            //{
            //    return NotFound("No bookings found for the user.");
            //}

            return Ok(bookings);
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var users = _userManager.Users.ToList();
            var results = new List<UserWithRolesDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                results.Add(new UserWithRolesDto
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Roles = roles
                });
            }
            return Ok(results);
        }

        [HttpPost("users/promote")]
        public async Task<IActionResult> PromoteToAdmin([FromBody] PromoteUserDto userDto)
        {

            if (string.IsNullOrEmpty(userDto.Email))
                return BadRequest(new { Message = "Email is required." });

            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if (user == null)
                return NotFound(new { Message = "User not found." });

            if (!await _roleManager.RoleExistsAsync("Admin"))
                return StatusCode(500, new { Message = "Admin role does not exist." });

            if (await _userManager.IsInRoleAsync(user, "Admin"))
                return BadRequest(new { Message = "User is already an Admin." });

            var result = await _userManager.AddToRoleAsync(user, "Admin");
            if (!result.Succeeded)
            {
                _logger.LogWarning("Failed to promote user {UserId} to Admin: {Errors}", userDto.Email,
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return StatusCode(500, new { Message = "Failed to promote user to Admin.", Errors = result.Errors });
            }
            _logger.LogInformation("User {Email} promoted to Admin by {By}", userDto.Email, User?.Identity?.Name ?? "system");
            return Ok(new { Message = "User promoted to Admin successfully." });
        }

        [HttpPost("users/demote")]
        public async Task<IActionResult> DemoteFromAdmin([FromBody] PromoteUserDto userDto)
        { 
            if(string.IsNullOrEmpty(userDto.Email))
                return BadRequest(new{ Message = "Email is required." });
            var user = await _userManager.FindByEmailAsync(userDto.Email);
            if(user == null)
                return NotFound(new{ Message = "User not found." });
            if(!await _roleManager.RoleExistsAsync("Admin"))
                return BadRequest(new { Message = "User is not an Admin." });
            // Prevent self-demotion
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(user.Id == currentUserId)
                return BadRequest(new { Message = "You cannot demote yourself." });
            // prevent removing the last admin
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            if(admins.Count <= 1)
                return BadRequest(new { Message = "Cannot demote the last remaining Admin." });

            var result = await _userManager.RemoveFromRoleAsync(user, "Admin");
            if(!result.Succeeded)
            {
                _logger.LogWarning("Failed to demote user {UserId} from Admin: {Errors}", userDto.Email,
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return StatusCode(500, new { Message = "Failed to demote user from Admin.", Errors = result.Errors });
            }
            _logger.LogInformation("User {Email} demoted from Admin by {By}", userDto.Email, User?.Identity?.Name ?? "system");
            return Ok(new { Message = "User demoted from Admin successfully." });

        }

    }
}