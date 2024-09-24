import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MembersService } from '../_services/members.service';
import { MessageService } from '../_services/message.service';
import { Member } from '../_models/member';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../_models/messages';
import { RouterLink } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgIf,ButtonsModule,FormsModule,TimeagoModule,TimeagoModule,RouterLink,PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit{
  public messageServices = inject(MessageService);
public memberServices = inject(MembersService);


members: Member[] =[];
container: string = 'Inbox';
messages: Message[]=[]
// container="Inbox";
pageNumber = 1 ;
pageSize= 5 ;
currentPage: any;
location: any;
@Input() username?: string;

isOutbox= this.container ==='Outbox'

ngOnInit(): void {
      this.loadMessages()
}


loadMessages()
{
    this.messageServices.getMessages(this.pageNumber,this.pageSize,this.container)
 }

deleteMessages(id: number)
 {
     this.messageServices.deleteMessages(id).subscribe({
      next: _=>{
        this.messageServices.paginatedResult.update(prev=>
        {
          if (prev && prev.items) {
            prev.items.splice(prev.items.findIndex(m => 
              m.id === id
            ),1)
            return prev
          }
          return prev
        }
        )
      }
     })
  }

getRout(message:Message){
if (this.container == 'Outbox') {
  return `/members/${message.receiverName}`
}
else{
  return  `/members/${message.senderName}`
}
}



pageChanged(e: any){
  if (this.pageNumber != e.page) {
    this.pageNumber= e.page;
    this.loadMessages()
  }
  }
}
