import { Component, inject, Input, input, InputSignal, OnChanges, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../_models/messages';
import { MessageService } from '../../_services/message.service';
import { MembersService } from '../../_services/members.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [TimeagoModule,FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{


  @ViewChild('messageForm') messageForm?: NgForm
public messageServices = inject(MessageService);
public memberServices = inject(MembersService);


@Input() username?: string;
@Input() messages?: Message[]=[]
  // messages= input.required<Message[]>()
  // username= input.required<string>()
  
messageContent = ''
updateMessages = output<Message>()


ngOnInit(): void {
  this.loadMessages();
}

loadMessages(): void {
  if(this.username){
  this.messageServices.messageThread(this.username).subscribe({
    next: (messages) => {
      this.messages = messages;
    },
    error: (err) => {
      console.error('Error loading messages:', err);
    }
  });
}
}


sendMessage() {
  if (this.username) {
    this.messageServices.sendMessages(this.username, this.messageContent).subscribe({
      next: message => {
        this.updateMessages.emit(message);
        this.messageForm?.reset()
      }
    });
  } 
}


}
