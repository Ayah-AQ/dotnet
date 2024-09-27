using System.ComponentModel.DataAnnotations;

namespace Demo.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public required string KnownAs { get; set; }
        [Required]
        public string? DateOFBirth { get; set; }
        [Required]
        public string? Gender { get; set; }
        [Required]
        public string? City { get; set; }
        [Required]
        public string? Country { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; } = string.Empty;
    }
}
