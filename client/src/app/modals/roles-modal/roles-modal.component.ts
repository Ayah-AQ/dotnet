import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [],
  templateUrl: './roles-modal.component.html',
  styleUrl: './roles-modal.component.scss'
})
export class RolesModalComponent {

  bsModalRef= inject(BsModalRef)
  title= ''
  availableRoles: string[]=[]
  SelectedRoles: string[]=[]
  rolesUpdated= false
  userName= ''

  updateChecked(checkedVale: string){
    if (this.SelectedRoles.includes(checkedVale)) {
      this.SelectedRoles= this.SelectedRoles.filter(r=>
        r !== checkedVale)
    }
    else{
      this.SelectedRoles.push(checkedVale)
    }
  }

onSelectRoles(){
  this.rolesUpdated = true
  this.bsModalRef.hide()
}

}
