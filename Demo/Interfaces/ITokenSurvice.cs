using Demo.Entities;

namespace Demo
{
    public interface ITokenSurvice
    {
        Task<string> CreateToken(AppUser user);
    }
}
