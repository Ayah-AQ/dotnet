using Demo.DTOs;
using Demo.Extintions;
using Demo.Helpers;
using Demo.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Demo.Controllers;

//[ApiController]
//[Route("/[controller]")]


public class LikesController(ILikeReposatory likeReposatory) : BaseApiController
{
    [HttpPost("{targetUserId:int}")]
    public async Task<ActionResult> ToggleLike(int targetUserId)
    {
        var sourceUserId = User.GetUserId();
        if (sourceUserId == targetUserId)
        {

            return BadRequest("You cannot like yoursef");
        }
        var exisistingLike = await likeReposatory.GetUserLike(sourceUserId, targetUserId);
        if (exisistingLike == null)
        {
            var like = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUserId
            };

            likeReposatory.AddLike(like);

        }

        else
        {
            likeReposatory.DeleteLike(exisistingLike);
        }


        if (await likeReposatory.SaveChanges())
        {
            return Ok();
        }

        return BadRequest("filed to like");

    }




    [HttpGet("list")]
    public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikesId()
    {
        return Ok(await likeReposatory.GetCurrentUserLikeId(User.GetUserId()));
    }

    [HttpGet()]
    public async Task<ActionResult<IEnumerable<IEnumerable<MemberDto>>>> GetUserLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var users = await likeReposatory.GetUserLikes(likesParams);

        Response.AddPaginationHeader(users);

        return Ok(users);
    }
}
