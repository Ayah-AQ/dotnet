import { Component,  } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { NavComponent } from '../nav/nav.component';


@Component({
  selector: 'app-home',
  
  standalone: true,
  imports: [RegisterComponent,NavComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  registerMode = false




registerToggle() {
  this.registerMode= !this.registerMode
}

cancelRegisterMode(event:boolean){
  this.registerMode = event
}



}
