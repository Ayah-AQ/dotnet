import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => { //Guard, which is a function that acts as a route guard in an Angular application. 
  //purpose of an Guard is to control access to routes based on whether a user is authenticated or has the necessary permissions. Inside the function, 
  //you would typically implement logic to check the user's authentication status (like checking a token or user role) 
  //and return a boolean value or an observable that resolves to a boolean.
  
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);



  if(accountService.currentUser()){
  return true;}
  else{
    toastr.error("Please signup first")
    router.navigate(['/signup']);
    return false;
  }
};
