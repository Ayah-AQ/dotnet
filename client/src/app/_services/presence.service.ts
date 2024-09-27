import { inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl= environment.hubsUrl
  private hubConnection?: HubConnection
  private toaster = inject(ToastrService)
  onlineUsers =signal<string[]> ([])


  createHubConnection(user: User){
    this.hubConnection= new HubConnectionBuilder()
    .withUrl(`${this.hubUrl}presence`,{
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection.start()
    .catch(e=> console.log(e));

    this.hubConnection.on('UserIsOnline', (userName) => {
      this.toaster.info(userName + ' has connected')
      console.log(this.onlineUsers())

    }) 
    // debugger
    this.hubConnection.on('GetOnlineUsers', (userNames) => {
      this.onlineUsers.set(userNames)
      console.log(this.onlineUsers())

    })


    
    this.hubConnection.on('UserIsOffline', (userName) => {
      this.toaster.warning(userName + ' has disconnected')
      this.onlineUsers.update(users => users.filter(u => u !== userName)); 
      // console.log("aaaaa",this.onlineUsers())
    })

   
    // this.hubConnection.on('GetOfflineUsers', userName => {
    //   this.onlineUsers.set([])
    // })


  }
  

  stopHubConnection(){
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(e=>console.log(e));
      
    }
  }

}
  
