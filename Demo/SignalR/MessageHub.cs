using AutoMapper;
using Demo.Data;
using Demo.DTOs;
using Demo.Entities;
using Demo.Extintions;
using Demo.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Demo.SignalR
{
    public class MessageHub(IUnitOfWork unitOfWork, IMapper mapper, IHubContext<PresenceHub> presenceHub) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];


            if (Context.User == null || string.IsNullOrEmpty(otherUser)) throw new Exception("Cannot join group");
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

           var group=  await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdateGroup", group);

            var messages = await unitOfWork.MessageReposatory.GetMessageThread(Context.User.GetUsername(), otherUser!);

            if (unitOfWork.HasChanged())
            {
                await unitOfWork.Complete();
            }

            await Clients.Caller.SendAsync("RecieveMessageThread", messages);

        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
           var group= await RemoveFromGroup();
            await Clients.Group(group.Name).SendAsync("UpdateGroup", group);
            await base.OnDisconnectedAsync(exception);
        }


        public async Task SendMessage(CreateMessageDto createMessageDto)
        {


            var username = Context.User.GetUsername() ?? throw new Exception("couldn't get user");
            if (username == createMessageDto.ReceiverName.ToLower())
            {

                throw new HubException("You can't message yourself.");
            }

            var sender = await unitOfWork.UserReposatory.GetUserByUsernameAsync(username);
            var reciever = await unitOfWork.UserReposatory.GetUserByUsernameAsync(createMessageDto.ReceiverName);

            if (reciever == null | sender == null || sender?.UserName == null || reciever?.UserName == null)
                throw new HubException("Message can't be send at this time");

            var message = new Message
            {
                Sender = sender,
                Receiver = reciever,
                SenderName = sender.UserName,
                ReceiverName = reciever.UserName,
                //SenderPhotoUrl = sender.PhotoUrl,  // Assuming PhotoUrl exists
                //ReceiverPhotoUrl = reciever.PhotoUrl,  // Assuming PhotoUrl exists
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, reciever.UserName);
            var group = await unitOfWork.MessageReposatory.GetMessageGroup(groupName);

            if (group != null && group.Connections.Any(x => x.UserName == reciever.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                var connections = await PresenceTracker.GetConnectionsForUsers(reciever.UserName);
                if(connections != null && connections?.Count != null)
                {
                    await presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved", 
                        new {userName= sender.UserName, knownAs= sender.KnownAs });
                }
            }

            unitOfWork.MessageReposatory.AddMessage(message);

            if (await unitOfWork.Complete())
            {

                await Clients.Group(groupName).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
            }
            if (reciever == null || sender == null || sender.UserName == null || reciever.UserName == null)
                throw new HubException("Fail to save");
        }

        private async Task<Group> AddToGroup(string groupName)
        {
            var username = Context.User?.GetUsername() ?? throw new Exception("Can't get username");
            var group = await unitOfWork.MessageReposatory.GetMessageGroup(groupName);
            var connection = new Connection { ConnectionId = Context.ConnectionId, UserName= username};

            if (group == null)
            {
                group = new Group { Name = groupName };
                unitOfWork.MessageReposatory.AddGroup(group);
            }

            group.Connections.Add(connection);

            if (await unitOfWork.Complete()) return group;

            throw new HubException("Failed to join");
        }


        private async Task<Group> RemoveFromGroup()
        {

            var group = await unitOfWork.MessageReposatory.GetGroupForConnection(Context.ConnectionId);
            var connection = group?.Connections.FirstOrDefault(x => x.ConnectionId== Context.ConnectionId);
            if (connection != null && group != null)
            {
                unitOfWork.MessageReposatory.RemoveConnection(connection);

                if (await unitOfWork.Complete()) return group;

            }

            throw new Exception("Faild to remove");

        }


        private string GetGroupName(string caller, string? other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
