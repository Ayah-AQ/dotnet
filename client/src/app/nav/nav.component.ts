import { Component, inject, input, Input } from '@angular/core';
import { CommonModule,} from '@angular/common';

import { FormsModule } from '@angular/forms'; 
import { AccountService } from '../_services/account.service';
import { NgIf } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../home/home.component';
import { HasRoleDirective } from '../_directive/has-role.directive';
import { MembersService } from '../_services/members.service';
import { Member } from '../_models/member';
@Component({
  selector: 'app-nav',
  standalone: true,
imports: [NgIf,FormsModule,CommonModule,BsDropdownModule,RouterLink,RouterLinkActive,HomeComponent,HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  accountService= inject(AccountService);
  memberService= inject(MembersService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  @Input() usersFromHomeComponent: any;
//  usersFromHomeComponent = input.required<any>();
  model: any={}; 

login() {
  this.accountService.login(this.model).subscribe({
    next: () => {
      this.router.navigateByUrl("/members")

    },
    error: (error) => {
      this.toastr.error(error.error)
    },
    
  });
}
logout(){
this.accountService.logout();
this.router.navigateByUrl("/")

}

}
