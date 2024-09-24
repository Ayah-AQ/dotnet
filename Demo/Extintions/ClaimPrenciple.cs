using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace Demo.Extintions;

    public static class ClaimsPrencipalExtention
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            var username = user.FindFirstValue(ClaimTypes.Name)
               ?? throw new Exception("cannot get user name");
            

            return username;
        }



    public static int GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
           ?? throw new Exception("cannot get user id");


        return int.Parse(userId);
    }

}

