namespace Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using DTOs.Auth;
    using Models;
    using Services.Interfaces;

    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService  _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
        [HttpPost("register")]
        public IActionResult Register(LoginRequest request)
        {
           _authService.Register(request);
            return Ok(new { message = "User registered successfully" });
        }
        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            var result = _authService.Login(request);
            return Ok(result);
        }
    }
}