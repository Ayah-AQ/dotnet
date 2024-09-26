import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  private likeService = inject(LikesService)
 private http = inject(HttpClient);
 baseUrl = environment.apiUrl;

 currentUser = signal<User | null>(null); //This function (or constructor) creates a reactive state. Changes to this state will trigger updates in any components or functions that depend on it.

roles= computed(()=>{ //reactive programming approach to create a computed property. The value of roles will automatically update when its dependencies change.

  const user= this.currentUser(); //get the current user's information, which is expected to return an object containing user data, including a JWT.

  if (user && user.token) {
    const role= JSON.parse(atob(user.token.split('.')[1])).role 
    //JWTs are typically composed of three parts: a header, a payload, and a signature, separated by periods (.).
    //The second part (index 1) is the payload, which contains the claims (like roles).
    //After parsing the object, we access the role property, which should contain the user's role(s).
    //atob: This function decodes a base64-encoded string. The payload of the JWT is base64-encoded, so it needs to be decoded to access the contained information.
    //JSON.parse: After decoding, this parses the JSON string into an object.
    
    return Array.isArray(role)? role : [role]
    //This checks if the role variable is an array. 
    //If the user has multiple roles, it may be stored as an array; otherwise, it might just be a single role represented as a string.
    //returns the role directly if it is already an array. If it's not an array (meaning the user has a single role), it wraps that single role in an array.
    // This ensures that the function always returns an array, whether the user has one role or multiple roles.
  }
  return []
})


 login(model:any){ //The method takes one parameter model, which is expected to contain user credentials (like username and password).
  return this.http.post<User>(this.baseUrl+"account/login", model ).pipe( //The pipe operator allows chaining multiple RxJS operators. Here, it uses map to transform the emitted value.
  map(user=>{
    if (user) {
     this.setCurrentUser(user)
    }
  })
  )
 }

 register(model:any){
  return this.http.post<User>(this.baseUrl+"account/register", model ).pipe
    (map(user=>{
      if (user) {
       this.setCurrentUser(user)
      }
    })
    )
 }

setCurrentUser(user: User){
   localStorage.setItem('user',JSON.stringify(user));
        this.currentUser.set(user);
        this.likeService.getLikeIds()
}

//This line converts the user object into a JSON string using JSON.stringify() and stores it in the browser's local storage under the key 'user'. 
//This allows the user information to persist even if the page is reloaded or the browser is closed and reopened.
//updates the application's current user state by calling a set method on an object or service called currentUser. 
//This is likely part of a state management system, where currentUser keeps track of the currently logged-in user throughout the application.
//Finally, this line calls a method getLikeIds() from a service called likeService.
// This method presumably retrieves the IDs of items that the current user has liked, which could be necessary to update the UI or manage user interactions.


 logout(){
  localStorage.removeItem('user')
  this.currentUser.set(null)
 }
}
