using Demo.Helpers;

namespace Demo.Extintions
{
    public class MessageParams :PaginationParams
    {
        public string? UserName { get; set; }
        public string Container { get; set; } = "Unread";
    }
}
