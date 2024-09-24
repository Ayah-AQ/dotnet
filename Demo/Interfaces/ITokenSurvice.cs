using Demo.Entities;

namespace Demo
{
    public interface ITokenSurvice
    {
        string CreateToken(AppUser user);
    }
}
