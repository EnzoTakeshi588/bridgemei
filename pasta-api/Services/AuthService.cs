using Models;
using Repositories.Interfaces;
using DTOs.Auth;
using Services.Interfaces;

namespace Services
{
    // Implementation of authentication service
    public class AuthService : IAuthService
    {
        // Method to authenticate user
        private readonly IUserRepository _userRepository;

        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public void Register(RegisterRequest request)
        {
            var existingUser = _userRepository.GetUserByEmail(request.Email);
            if (existingUser != null)
            {
                throw new Exception("User already exists");
            }
            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };
            _userRepository.AddUser(user);
        }
        public LoginResponse Login(LoginRequest request)
        {
          var user = _userRepository.GetUserByEmail(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password");
            }
            // Generate JWT token here and return it
            return new LoginResponse
            {
                Token = "fake-jwt" // Replace with actual token generation logic
            };
        }
    }
}