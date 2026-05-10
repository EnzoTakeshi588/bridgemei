namespace Repositories.Interfaces
{
    using Models;

    public interface IUserRepository
    {
        User GetUserByEmail(string email);
        void AddUser(User user);
    }
}
