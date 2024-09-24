import { Component, inject, input, Input } from '@angular/core';
import { CommonModule,} from '@angular/common';

import { FormsModule } from '@angular/forms'; 
import { AccountService } from '../_services/account.service';
import { NgIf } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-nav',
  standalone: true,
imports: [NgIf,FormsModule,CommonModule,BsDropdownModule,RouterLink,RouterLinkActive,HomeComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  accountService= inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  @Input() usersFromHomeComponent: any;
//  usersFromHomeComponent = input.required<any>();
  model: any={}; 
 

//   ngOnInit(): void {
// this.http.get('https://localhost:5001/user').subscribe({
//   next: response=> this.users[0] = response,
//   error: error=> console.log(error),
//   complete: ()=> console.log('compleated/'),
 
// })
  // }

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
