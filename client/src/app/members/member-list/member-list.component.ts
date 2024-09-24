import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../_services/account.service';
import { UserParamsClass } from '../../_models/userParams';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent,PaginationModule,FormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit{
 memberService = inject(MembersService)


  members: Member[] =[];
  pageNumber = 1 ;
  pageSize= 5 ;
currentPage: any;
genderList = [{value: 'male', display: 'Males'},{value: 'female', display: 'Females'}]

ngOnInit(): void {
  if (!this.memberService.paginationResults()) { 
    
    return this.loadMembers() ;
  }

}

loadMembers(){
  this.memberService.getMembers() 
 
  
}

restFilters(){
  this.memberService.resetuserParams();
  this.loadMembers()
}


pageChanged(e: any){
if (this.memberService.userParams().pageNum != e.page) {
  this.memberService.userParams().pageNum= e.page;
  this.loadMembers()
}
}
}
