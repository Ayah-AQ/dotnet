import { Component, HostListener, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { MembersService } from '../../_services/members.service';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../_models/member';
import { Router } from '@angular/router';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [DatePipe,TabsModule, FormsModule, PhotoEditorComponent, PhotoEditorComponent,PhotoEditorComponent,TimeagoModule

  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss'
})
export class MemberEditComponent implements OnInit{
  @ViewChild("editForm") editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any){
        if (this.editForm?.dirty) {
      $event.returnValue= 'You have unsaved changes!'; 
    };
  }  

member?: Member;
originalDateOFBirth?: string;
private memberService = inject(MembersService)
private accountService = inject(AccountService)
private toaster = inject(ToastrService)
private router = inject(Router);


ngOnInit(): void {
  this.loadMember()

}

loadMember(){
  const user= this.accountService.currentUser();
  if (!user) {
    console.log(user)
    return

  }
  this.memberService.getMember(user.userName).subscribe ({
    next: member => 
      {this.member = member;
    this.originalDateOFBirth = this.member?.DateOFBirth}
  }) 

}


updateMember(){
  
  const name= this.member?.userName
  if (this.editForm?.value.DateOFBirth === this.originalDateOFBirth) {
    delete this.editForm?.value.DateOFBirth; 
  }


  this.memberService.updateMember(this.editForm?.value).subscribe(
    {
    next:_  =>{
       this.toaster.success("Profile was updated")
  this.editForm?.reset(this.member )
  this.router.navigateByUrl(`/members/${name}`)


  if (name !== this.accountService.currentUser()?.userName) {
    this.logout();
  }
},
  }
)
 
}

logout(){
  this.accountService.logout();
  this.router.navigateByUrl("/")
  
  }


  onMemberChange(e:Member){
    this.member= e
    }


}
