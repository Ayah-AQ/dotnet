using Microsoft.AspNetCore.Identity;

namespace Demo.Entities
{
    public class AppRole :IdentityRole<int>    {
        public ICollection<AppUserRole> UserRoles { get; set; } = [];
    }
}
