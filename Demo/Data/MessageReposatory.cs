using AutoMapper;
using AutoMapper.QueryableExtensions;
using Demo.DTOs;
using Demo.Entities;
using Demo.Extintions;
using Demo.Helpers;
using Demo.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace Demo.Data
{
    public class MessageReposatory(DataContext context, IMapper mapper) : IMessageReposatory
    {
        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Remove(message);
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages.FindAsync(id);
        }

       
        public async Task<pagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages
                .OrderByDescending(x => x.SentDate)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.Receiver.UserName == messageParams.UserName && x.ReceiverDelete == false),
                "Outbox" => query.Where(x => x.Sender.UserName == messageParams.UserName && x.SenderDelete ==false),
                _ => query.Where(x => x.Receiver.UserName == messageParams.UserName && x.DateRead == null && x.ReceiverDelete==false),
            };

            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await pagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
            

        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recieverUserName)
        {
            var message = await context.Messages
                .Include(x => x.Sender).ThenInclude(x => x.Photos)
                .Include(x => x.Receiver).ThenInclude(x => x.Photos)
                .Where(x => x.ReceiverName == currentUserName && x.ReceiverDelete == false && x.SenderName == recieverUserName ||
                x.SenderName == currentUserName && x.SenderDelete==false && x.ReceiverName == recieverUserName)
                .OrderBy(x => x.SentDate)
                .ToListAsync();



            var unreadMessages = message.Where(x => x.DateRead == null && x.ReceiverName == currentUserName).ToList();

            if (unreadMessages.Count != 0)
            {
                unreadMessages.ForEach(x => x.DateRead = DateTime.UtcNow);
                await context.SaveChangesAsync();
            }


            return mapper.Map<IEnumerable<MessageDto>>(message);
        }
     public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }
    
    }
}
