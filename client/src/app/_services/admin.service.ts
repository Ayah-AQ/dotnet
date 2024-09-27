import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../_models/user';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);



  baseUrl = environment.apiUrl;



 
  getUsersWithRoles(){
    
    return this.http.get<User[]>(`${this.baseUrl}admin/users-with-roles`);
  }

 
  editRoles(userName:string, roles: string[]){
    return this.http.post<string[]>(`${this.baseUrl}admin/edit-roles/${userName}?roles=${roles}`, {})
  }


  getPhotosForModeration(){

  }

}
