import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../_models/pagination';
import { Message } from '../_models/messages';
import { setPaginationHeaders, setPaginationRes } from './paginationhelper';
import { Observable } from 'rxjs';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../_models/user';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl= environment.apiUrl
  hubUrl= environment.hubsUrl

  private http= inject(HttpClient)
   hubConnection?: HubConnection;

  paginatedResult = signal<PaginationResult<Message[]>| null> (null);
  messageThreads= signal<Message[]>([]);

createHubConnection(user: User, otherUserName: string){
this.hubConnection= new HubConnectionBuilder()
.withUrl(`${this.hubUrl}message?user=${otherUserName}`,{
  accessTokenFactory: () => user.token
  })
  .withAutomaticReconnect()
  .build();

  this.hubConnection.start().catch(e=> console.log(e));

  this.hubConnection.on('RecieveMessageThread',message =>{
this.messageThreads.set(message)
  });

  this.hubConnection.on('NewMessage',(message) =>{
   this.messageThreads.update(messages => [...messages,message])
      });

      this.hubConnection.on('UpdateGroup',(group: Group) =>{
        if (group.connection.some(x=>x.userName == otherUserName)) {
          this.messageThreads.update(messages => 
            {messages.forEach( message=> {
              if (!message.dateRead) {
                message.dateRead = new Date(Date.now())
              }
            }) 
            return messages
          })
          }
           });

}


stopHubConnection(){
  if(this.hubConnection?.state === HubConnectionState.Connected) {
    this.hubConnection.stop().catch(e=>console.log(e))
  }
}


getMessages(pageNumber:number, pageSize:number,container:string){
  let params= setPaginationHeaders(pageNumber,pageSize)
  .append("Container",container);

  return this.http.get<Message[]>(`${this.baseUrl}messages`, {observe:'response', params})
  .subscribe({
    next: res =>
      setPaginationRes(res,this.paginatedResult)
  })
}

messageThread(userName: string){

  return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${userName}`)
}


async sendMessages(userName: string, content: string){
  // return this.http.post<Message>(`${this.baseUrl}messages`, {receiverName: userName, content})
  return this.hubConnection?.invoke('SendMessage', { receiverName: userName, content });
}


// async sendMessages(userName: string, content: string) {
//   if (this.hubConnection?.state === HubConnectionState.Connected) {
//     try {
//       await this.hubConnection.invoke('SendMessage', { receiverName: userName, content });
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   } else {
//     console.error("Hub connection is not established.");
//   }
// }

deleteMessages(id: number){

  return this.http.delete<Message>(`${this.baseUrl}messages/${id}`)
}

}
