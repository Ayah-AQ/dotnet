using Demo.Extintions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Demo.Entities;


public class AppUser :IdentityUser<int>
{


    public DateOnly DateOFBirth { get; set; }
    public required string KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime lastActive { get; set; } = DateTime.UtcNow;
    
    public string? LookingFor { get; set; }
    public required string Gender { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
  
    public List<Photo> Photos { get; set; } = [];
    public List<UserLike> LikedBy { get; set; } = [];
    public List<UserLike> Liked  { get; set; } = [];
    public List<Message> MessagesSent { get; set; } = [];
    public List<Message> MessagesRecievied { get; set; } = [];
    public ICollection<AppUserRole> UserRoles { get; set; } = [];

    //public int GetAge()
    //{
    //    return DateOFBirth.CalculateAge();
    //}
}