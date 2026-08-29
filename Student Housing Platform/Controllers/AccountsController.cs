using Student_Housing_Platform.Dtos.AccountDtos;

namespace Student_Housing_Platform.Controllers
{
    // this controller will receive the registers and login requests
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        public AccountsController(ITokenService tokenService,
                                  UserManager<ApplicationUser> userManager,
                                  SignInManager<ApplicationUser> signInManager)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        //-----Login-------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid Email or Password");

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginDto.Password,
                false
            );

            if (!result.Succeeded)
                return Unauthorized("Invalid Email or Password");

            var roles = await _userManager.GetRolesAsync(user);

            var token = _tokenService.CreateToken(user, roles.ToList());

            var loginResponse = new LoginResponseDto
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = token,
                Roles = roles
            };

            return Ok(loginResponse);
        }
        //-------Register--------------
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]RegisterDto registerDto)
        {
            if(!ModelState.IsValid)
                return BadRequest(ModelState);

            var userExists = await _userManager.FindByEmailAsync(registerDto.Email);
            if(userExists != null)
                return BadRequest("Email is already registered");

            var newUser = new ApplicationUser
            {
                Email = registerDto.Email,
                UserName = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName
            };

            var result = await _userManager.CreateAsync(newUser, registerDto.Password);
            if(!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }
            var roleExists = await _userManager.IsInRoleAsync(newUser, "Customer"); //expected to be false
            var addRoleResult = await _userManager.AddToRoleAsync(newUser, "Customer");
            if(!addRoleResult.Succeeded)
            {
                var errors = addRoleResult.Errors.Select(e => e.Description);
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Failed to assign default role.", Errors = errors });
            }
            var roles = await _userManager.GetRolesAsync(newUser);
            var token = _tokenService.CreateToken(newUser, roles.ToList());
            var loginResponse = new LoginResponseDto
            {
                Email = newUser.Email,
                FirstName = newUser.FirstName,
                LastName = newUser.LastName,
                Token = token,
                Roles = roles
            };
            return Ok(loginResponse);
        }

        //-------Get Current User--------------
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found in token.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new MeDto
            {
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles
            });
        }

        //-------Update Current User--------------
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateMeDto updateMeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found in token.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            user.FirstName = updateMeDto.FirstName.Trim();
            user.LastName = updateMeDto.LastName.Trim();

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { Errors = errors });
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new MeDto
            {
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Roles = roles
            });
        }
    }
}
