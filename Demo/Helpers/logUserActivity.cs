using Demo.Extintions;
using Demo.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Threading.Tasks;

namespace Demo.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next(); 

            if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

            var userId = resultContext.HttpContext.User.GetUserId();
            var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserReposatory>();
            var user = await repo.GetUserByIdAsync(userId);

            if (user == null)
            {
                return;
            }

            user.LastActive = DateTime.UtcNow;
            await repo.SaveAllAsync();
        }
    }
}
