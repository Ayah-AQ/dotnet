using AutoMapper;
using AutoMapper.Execution;
using Demo.Data;
using Demo.DTOs;
using Demo.Entities;
using Demo.Extintions;
using Demo.Helpers;
using Demo.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Claims;

namespace Demo.Controllers;

[ApiController]
[Route("/[controller]")]

[Authorize]
public class UserController(IUnitOfWork unitOfWork, IMapper mapper, IphotoService photoService) : BaseApiController
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
      
    {
        userParams.CurrentUserName=User.GetUsername();
        
        var users = await unitOfWork.UserReposatory.GetMembersAsync(userParams);

        Response.AddPaginationHeader(users);

        return Ok(users);
    }

    //private async Task<ActionResult<IEnumerable<AppUser>>> GetUsersAsync()
    //{
    //    throw new NotImplementedException();
    //}

    [HttpGet("{username}")]
    public async Task<ActionResult<MemberDto>> GetUser(string username)
    {
        var user = await unitOfWork.UserReposatory.GetMemberAsync(username);

        if (user == null) return NotFound();

        return  mapper.Map<MemberDto>(user);

    }


    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
    {
        var username = User.GetUsername();
        var user = await unitOfWork.UserReposatory.GetUserByUsernameAsync(username);

       
        if (user == null)
        {
            return BadRequest("User not found.");
        }

        
        var dob = user.DateOFBirth; 

        if (memberUpdateDto.DateOFBirth == null)
        {
            user.DateOFBirth = dob;
        }
        mapper.Map(memberUpdateDto, user);


        
        if (await unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Failed to update the user.");
    }


    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
    {


        var user = await unitOfWork.UserReposatory.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("no user");
        

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null) return BadRequest(result.Error.Message);


        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
        };

        if (user.Photos.Count == 0)
        {
            photo.IsMain = true;

        }

        user.Photos.Add(photo);

        if (await unitOfWork.Complete())
            return CreatedAtAction(nameof(GetUsers),
                new { username= user.UserName}, mapper.Map<PhotoDto>(photo)); 
        
      return BadRequest("Problem while adding photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {


        var user = await unitOfWork.UserReposatory.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("no user");


        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

        if (photo == null || photo.IsMain) return BadRequest("Cannot use it as main photo");


        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
        if (currentMain != null) currentMain.IsMain = false;
        photo.IsMain = true;

        

        if (await unitOfWork.Complete())
            return NoContent();

        return BadRequest("Problem while adding photo");
    }


[HttpDelete("delete-photo/{photoId:int}")]
public async Task<ActionResult> DeletenPhoto(int photoId)
{
        var user = await unitOfWork.UserReposatory.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return BadRequest("no user");


    var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
    if (photo == null || photo.IsMain) return BadRequest("Cannot delete photo");

    if (photo.PublicId != null)
        {
            var result = await photoService.DeletePhotoAsync(photo.PublicId);
            if (result.Error != null) return BadRequest(result.Error.Message);

        }

        user.Photos.Remove(photo);

        if (await unitOfWork.Complete())
        return Ok();

    return BadRequest("Problem while adding photo");
}


}


