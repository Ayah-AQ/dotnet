using Demo.DTOs;
using Demo.Entities;
using Demo.Extintions;
using Demo.Helpers;

namespace Demo.Interfaces
{
    public interface IMessageReposatory
    {
        void DeleteMessage(Message message);
        void AddMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<pagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recieverUserName);
        //Task<bool> SaveAllAsync();
       void AddGroup(Group group);
      void RemoveConnection(Connection connection);
        Task<Connection?> GetConnection(string connectionId);
        Task<Group?> GetMessageGroup(string groupName);
        Task<Group?> GetGroupForConnection (string connectionId);

    }
}
