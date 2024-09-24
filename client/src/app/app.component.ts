import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav.component'; 
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccountService } from './_services/account.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { NgxSpinnerComponent } from 'ngx-spinner';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,NavComponent,BsDropdownModule, HomeComponent, RegisterComponent,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  private accountService = inject(AccountService);
   

  ngOnInit(): void {
this.setCurrentUser();
  }

setCurrentUser(){
  const userString = localStorage.getItem('user');
  if(!userString) return;
  const user =JSON.parse(userString);
  this.accountService.setCurrentUser(user)
}


}
