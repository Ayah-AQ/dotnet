
using System.ComponentModel.DataAnnotations.Schema;

namespace Demo.Entities;


[Table("photos")]
public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
    public string? PublicId { get; set; }

    //navigation prop

    public int AppUserId{ get; set; }
    public AppUser AppUser { get; set; } = null;

    }