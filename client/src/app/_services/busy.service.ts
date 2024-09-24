import { inject, Injectable } from '@angular/core';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

busyReqCount =0
private spinnerService= inject(NgxSpinnerService);

busy(){
  this.busyReqCount++;
this.spinnerService.show(undefined,{
  type: 'ball-grid-pulse',
  bdColor: 'rgba(0, 0, 0, 0)',
  color : "#fff"
})
}

idle(){
  this.busyReqCount--;
if(this.busyReqCount<=0){
  this.busyReqCount =0,
  this.spinnerService.hide()
}
}

}
