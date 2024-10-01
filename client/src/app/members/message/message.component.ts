import { AfterViewChecked, Component, inject, Input, input, InputSignal, OnChanges, OnInit, output, SimpleChanges, ViewChild } from '@angular/core';
import { Message } from '../../_models/messages';
import { MessageService } from '../../_services/message.service';
import { MembersService } from '../../_services/members.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [TimeagoModule,FormsModule,CommonModule,NgFor],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements AfterViewChecked{


  @ViewChild('messageForm') messageForm?: NgForm
  @ViewChild('scrollMe') scrollContainer?: any
public messageServices = inject(MessageService);
public memberServices = inject(MembersService);
public accountServices = inject(AccountService);

private messageCount = 0;
// @Input() userName?: string;
messageContent = ''

// @Input() messages?: Message[]=[]
  // messages= input.required<Message[]>()
  userName= input.required<string>()
  
// updateMessages = output<Message>()


// ngOnInit(): void {
//   this.loadMessages();
// }

// loadMessages(): void {
//   if(this.userName){
//   this.messageServices.messageThread(this.userName).subscribe({
//     next: (messages) => {
//       this.messages = messages;

//     },
//     error: (err) => {
//       console.error('Error loading messages:', err);
//     }
//   });
// }
// }


sendMessage() {
  if (this.userName()) {
    // this.messageServices.sendMessages(this.userName, this.messageContent).subscribe({
    //   next: message => {
    //     // this.updateMessages.emit(message);
    //     this.messageForm?.reset()
    //   }
    // });

      this.messageServices.sendMessages(this.userName(), this.messageContent)?.then(()=> 
      {
        this.messageForm?.reset()
        this.messageCount++;
        this.scrollBottom(); 
    
      })
     }


}

ngAfterViewChecked(): void {

  if (this.scrollContainer && this.scrollContainer.nativeElement.scrollHeight > this.messageCount) {
    this.scrollBottom();
    this.messageCount = this.scrollContainer.nativeElement.scrollHeight;
  }
}


private scrollBottom(){
  if (this.scrollContainer) {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }
  
}

}
