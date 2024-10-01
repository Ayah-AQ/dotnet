import { Component, inject, Input, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import {GalleryItem, GalleryModule, ImageItem} from 'ng-gallery'
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from "ngx-timeago";
import { DatePipe, NgIf } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../_models/messages';
import { MessageService } from '../../_services/message.service';
import { MemberEditComponent } from "../member-edit/member-edit.component";
import { PresenceService } from '../../_services/presence.service';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account.service';
import { HubConnectionState } from '@microsoft/signalr';
@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [NgIf,TabsModule, GalleryModule, FormsModule, TimeagoModule, DatePipe, MessageComponent, MemberEditComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit, OnDestroy{


  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
   presenseService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  member: Member ={} as Member ;
  images: GalleryItem[]=[]
  activeTab ?: TabDirective
  // messages:Message[]=[]
@Input() userName?: string;

  // model: any ={};

  ngOnInit(): void {
    // console.log(this.member)
    // this.loadMember()
    this.route.data.subscribe({
      next: (d) => {
        this.member = d['member'];
  
        this.member && this.member.photos
        .map(p => 
          {this.images.push(new ImageItem({ src: p.url, thumb: p.url }))});
        
      }
    });
  

    this.route.paramMap.subscribe({
      next: _ =>
        this.onRoteParamsChange()
    })

    this.route.queryParams.subscribe({
      next: (p) => {
        if (p['tab']) {
          this.selectTab(p['tab']);
        }
      }
    });
  }

//   onUpdateMessages(event: Message){
// this.messages.push(event)
//   }
  
selectTab(heading: string){
if(this.memberTabs){
  const messageTab= this.memberTabs.tabs.find(x=>x.heading === heading)
  if (messageTab) messageTab.active = true
}
}

onRoteParamsChange(){
  const user = this.accountService.currentUser()
  if(!user) return;
  if(this.messageService.hubConnection?.state === HubConnectionState.Connected 
    && this.activeTab?.heading==='Messages'){
      this.messageService.hubConnection.stop().then
      (() => this.messageService.createHubConnection(user, this.member.userName))
    }
}

onTabActivated(data: TabDirective){
  this.activeTab =data;
  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: {tab:this.activeTab.heading},
    queryParamsHandling: 'merge'
  })
  if(this.activeTab.heading === 'Messages'&& this.member)  {
    const user= this.accountService.currentUser()
    if(!user)return;
    this.messageService.createHubConnection(user, this.member.userName)
  }
  else{
    this.messageService.stopHubConnection();
  }
}

ngOnDestroy(): void {
  this.messageService.stopHubConnection()
}

// loadMember(){
//   const userName =this.route.snapshot.paramMap.get('userName')
//   if(!userName) return;
//   this.memberService.getMember(userName).subscribe(
//  { next: member=> {
//   this.member = member;
//   member.photos.map(p=>{
//     this.images.push(new ImageItem({src:p.url, thumb: p.url}))
//   })
// }}
//   )
// }



}
