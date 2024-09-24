namespace Demo.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public required string SenderName { get; set; }
        public required string ReceiverName { get; set; }
        public required string content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime SentDate { get; set; } = DateTime.UtcNow;
        public bool SenderDelete { get; set; }
        public bool ReceiverDelete { get; set; }



        //navigation properties

        public int SenderId { get; set; }
        public AppUser Sender { get; set; } = null;
        public int ReceiverId { get; set; }
        public AppUser Receiver { get; set; } = null;

    }
}
