using Demo.Data;
using Demo.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Demo.Controllers
{
    public class ErrorHandler(DataContext context) : BaseApiController
    {
        [Authorize]
        // 401
        [HttpGet("auth")]
        public ActionResult<string> GetAuth()
        {
            return "secret text";
        }

        //404
        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {

            var thing = context.Users.Find(-1);
            if (thing == null) return NotFound();
            return thing;
        }
        //500
        [HttpGet("server-error")]
        public ActionResult<AppUser> GetServerError()
        {
           
                var thing = context.Users.Find(-1) ?? throw new Exception("Bad thing happened");
            return thing;

            
           
        }
        //400
        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("something went wrong");
        }
    }
}
