

namespace Demo.DTOs
{
    public class MemberUpdateDto
    {
        public required string UserName { get; set; }
        public DateOnly? DateOFBirth { get; set; }
        public required string KnownAs { get; set; }
        public string? LookingFor { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
    }
}


