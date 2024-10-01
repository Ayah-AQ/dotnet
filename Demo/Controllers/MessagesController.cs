using AutoMapper;
using Demo.DTOs;
using Demo.Entities;
using Demo.Extintions;
using Demo.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Demo.Controllers
{
    [Authorize]
    public class MessagesController(IMapper mapper,IUnitOfWork unitOfWork) : BaseApiController
    {
        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
            if (username == createMessageDto.ReceiverName.ToLower())
            {
                return BadRequest("You can't message yourself.");
            }

            var sender = await unitOfWork.UserReposatory.GetUserByUsernameAsync(username);
            var reciever = await unitOfWork.UserReposatory.GetUserByUsernameAsync(createMessageDto.ReceiverName);

            if (reciever == null | sender == null ||sender?.UserName ==null || reciever?.UserName== null) return BadRequest("Message can't be send at this time");

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

            unitOfWork.MessageReposatory.AddMessage(message);

            if (await unitOfWork.Complete())
            {
                return Ok(mapper.Map<MessageDto>(message));
            }

            return BadRequest("Fail to save");
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages([FromQuery] MessageParams messageParams)
        {
            messageParams.UserName = User.GetUsername();

            var messages = await unitOfWork.MessageReposatory.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(messages);
            return messages;
        }




        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetThread(string username)
        {

           var currentUsername= User.GetUsername();
            
            return Ok(await unitOfWork.MessageReposatory.GetMessageThread(currentUsername,username));
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DleteMessage(int id)
        {

            var username = User.GetUsername();
            var message = await unitOfWork.MessageReposatory.GetMessage(id);

            if (message == null) return BadRequest("No Message was added");
            if (message.SenderName != username && message.ReceiverName != username) return Forbid();
            
            if (message.SenderName == username ) message.SenderDelete= true;
            if ( message.ReceiverName == username) message.ReceiverDelete=true;

            if(message.SenderDelete == true && message.ReceiverDelete ==true)
            {
                unitOfWork.MessageReposatory.DeleteMessage(message);
            }

            if (await unitOfWork.Complete())
            {
                return Ok();
            }

            return BadRequest("Can't delete the message");
        }
    }
}
