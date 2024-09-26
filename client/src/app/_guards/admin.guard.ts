import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  const router = inject(Router);



  if(accountService.roles().includes('Admin')||
  accountService.roles().includes('Moderator')){
  return true;}
  else{
    toastr.error("You are not able to use this part!")
    router.navigate(['members']);
    return false;
  
}
}
