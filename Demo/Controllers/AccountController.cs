using AutoMapper;
using Demo.Data;
using Demo.Dtos;
using Demo.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;

namespace Demo.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenSurvice TokenService,IMapper mapper) :BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Username)) return BadRequest("Username already taken");
        //using var hmac = new HMACSHA512();


        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();
        //user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
        //user.PasswordSalt = hmac.Key;

        // userManager.Users.Add(user);

      var results = await userManager.CreateAsync(user);

        if (!results.Succeeded) return BadRequest(results.Errors); 

        return new UserDto
        {
            Username = user.UserName,
            Token =await TokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender= user.Gender,
            PhotoUrl= user.Photos.FirstOrDefault(x => x.IsMain)?.Url
        };
    }


    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {

        var user = await userManager.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(
            x => x.NormalizedUserName == loginDto.Username.ToUpper());

        if (user == null || user.UserName == null) return Unauthorized("username does not exist");

        var results= await userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!results) return BadRequest("unauth");

        //using var hmac = new HMACSHA512(user.PasswordSalt);

        //var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        //for (int i = 0; i < computedHash.Length; i++) {
        //    if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("invalid pass");
        //}

        return new UserDto {
            KnownAs = user.KnownAs,
            Username = user.UserName,
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            Gender = user.Gender,
            Token = await TokenService.CreateToken(user), 
        
        };
           



    }
    /*
         //unique*/

        private async Task<bool> UserExists(string username)
        {
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
        }



}
