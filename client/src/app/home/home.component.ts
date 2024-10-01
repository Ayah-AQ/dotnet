import { Component, inject, input,  } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { NavComponent } from '../nav/nav.component';
import { Member } from '../_models/member';
import { MemberListComponent } from '../members/member-list/member-list.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  
  standalone: true,
  imports: [RegisterComponent,NavComponent,MemberListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  registerMode = false
  member: Member ={} as Member ;
  private router = inject(Router);





registerToggle() {
    this.registerMode= !this.registerMode
  }

cancelRegisterMode(event:boolean){
  this.registerMode = event
}



}
