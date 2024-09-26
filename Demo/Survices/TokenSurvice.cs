
using Demo.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Demo.Survices
{
    public class TokenService(IConfiguration config, UserManager<AppUser> userManager) :ITokenSurvice
    {

        public async Task<string> CreateToken(AppUser user)
        {
        var tokenKey = config["TokenKey"] ?? throw new Exception("Cannot access tokenKey from AppSittings");
            if (tokenKey.Length < 64) throw new Exception("your TokenKey needs to be longer");  
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            if (user.UserName == null) throw new Exception("No username for user");
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new (ClaimTypes.Name, user.UserName)
            };

            var roles = await userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));


            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires= DateTime.UtcNow.AddDays(7),
                SigningCredentials = cred
            };
            var tokenHAnddler = new JwtSecurityTokenHandler();  
            var token = tokenHAnddler.CreateToken(tokenDescriptor);
            return tokenHAnddler.WriteToken(token);
        }

    }
}
