namespace Demo.DTOs;
    public class MessageDto
    {

        public int Id { get; set; }
        public int SenderId { get; set; }
        public required string SenderName { get; set; }
        public required string SenderPhotoUrl { get; set; }
        public int RecieverId { get; set; }
        public required string ReceiverName { get; set; }
        public required string ReceiverPhotoUrl { get; set; }
        public required string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime SentDate { get; set; } 

    }


