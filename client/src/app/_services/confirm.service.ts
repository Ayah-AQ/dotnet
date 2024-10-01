import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../modals/confirm-dialog/confirm-dialog.component';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  bsModalref?: BsModalRef

  private modalServices= inject(BsModalService)

  confirm(
    title = 'Confirmation',
    message= 'Are you sure you want to leave without save changes',
    btnOkText='Continue',
    btnClose='Cancel'
  )
  {
    const config: ModalOptions = {
      initialState:{
        title ,
        message,
        btnOkText,
        btnClose,
      }

    }
      this.bsModalref= this.modalServices.show(ConfirmDialogComponent, config)
      return this.bsModalref.onHidden?.pipe(
        map(()=>{
          if (this.bsModalref?.content) {
            return this.bsModalref.content.result
          } else {
            return false
          }
        })
      )
}
}
