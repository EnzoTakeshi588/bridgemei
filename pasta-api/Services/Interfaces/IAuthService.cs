namespace Services.Interfaces
{
    using DTOs.Auth;

    public interface IAuthService
    {
        void Register(RegisterRequest request);
        LoginResponse Login(LoginRequest request);
    }
}