import { Component, inject, Input, input, OnInit, ViewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import {GalleryItem, GalleryModule, ImageItem} from 'ng-gallery'
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from "ngx-timeago";
import { DatePipe } from '@angular/common';
import { MessageComponent } from '../message/message.component';
import { Message } from '../../_models/messages';
import { MessageService } from '../../_services/message.service';
import { MemberEditComponent } from "../member-edit/member-edit.component";
@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, FormsModule, TimeagoModule, DatePipe, MessageComponent, MemberEditComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit{


  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  member: Member ={} as Member ;
  images: GalleryItem[]=[]
  activeTab ?: TabDirective
  messages:Message[]=[]
@Input() username?: string;

  // model: any ={};

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (d) => {
        this.member = d['member'];
  
        this.member && this.member.photos
        .map(p => 
          {this.images.push(new ImageItem({ src: p.url, thumb: p.url }))});
        
      }
    });
  
    this.route.queryParams.subscribe({
      next: (p) => {
        if (p['tab']) {
          this.selectTab(p['tab']);
        }
      }
    });
  }

  onUpdateMessages(event: Message){
this.messages.push(event)
  }
  
selectTab(heading: string){
if(this.memberTabs){
  const messageTab= this.memberTabs.tabs.find(x=>x.heading === heading)
  if (messageTab) messageTab.active = true
}
}


onTabActivated(data: TabDirective){
  this.activeTab =data;
  if(this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member)  {
    if (this.username) {
      this.messageService.messageThread(this.member?.username)
      .subscribe({

        next: m => this.messages=m
      })
    }

  }
}

// loadMember(){
//   const username =this.route.snapshot.paramMap.get('username')
//   if(!username) return;
//   this.memberService.getMember(username).subscribe(
//  { next: member=> {
//   this.member = member;
//   member.photos.map(p=>{
//     this.images.push(new ImageItem({src:p.url, thumb: p.url}))
//   })
// }}
//   )
// }



}
