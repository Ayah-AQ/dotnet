using System.Runtime.InteropServices.Marshalling;

namespace Demo
{
    public class LoginDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
