using Demo.DTOs;
using Demo.Extintions;
using Demo.Helpers;
using Demo.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Demo.Controllers;

//[ApiController]
//[Route("/[controller]")]


public class LikesController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();
        if (sourceUserId == targetUserId)
        {

            return BadRequest("You cannot like yoursef");
        }
        var exisistingLike = await unitOfWork.LikeReposatory.GetUserLike(sourceUserId, targetUserId);
        if (exisistingLike == null)
        {
            var like = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };

            unitOfWork.LikeReposatory.AddLike(like);

        }

        else
        {
            unitOfWork.LikeReposatory.DeleteLike(exisistingLike);
        }


        if (await unitOfWork.Complete())
        {
            return Ok();
        }

        return BadRequest("filed to like");

    }




    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikesId()
    {
        return Ok(await unitOfWork.LikeReposatory.GetCurrentUserLikeId(User.GetUserId()));
    }

    [HttpGet()]
    public async Task<ActionResult<IEnumerable<IEnumerable<MemberDto>>>> GetUserLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var users = await unitOfWork.LikeReposatory.GetUserLikes(likesParams);

        Response.AddPaginationHeader(users);

        return Ok(users);
    }
}
