import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { User } from '../../_models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [],
  templateUrl: './user-manage.component.html',
  styleUrl: './user-manage.component.scss',
})
export class UserManageComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);
  users: User[] = [];
  bsModalRef: BsModalRef<RolesModalComponent> =
    new BsModalRef<RolesModalComponent>();

  ngOnInit(): void {
    this.loadUsers();
  }

  
    createRoleModule(user: User){
      const initialState: ModalOptions ={
        class: 'modal-lg',
        initialState:{
          title: 'User roles',
          userName: user.userName,
          selectedRoles: [...user.roles],
          availableRoles:['Admin', 'Moderator','Member'],
          users: this.users,
          rolesUpdated: false
        }
      }
      this.bsModalRef= this.modalService.show(RolesModalComponent,initialState)
      this.bsModalRef.onHide?.subscribe({
        next: ()=>{
          if (this.bsModalRef.content && this.bsModalRef.content.rolesUpdated) {
            const selectedRoles= this.bsModalRef.content.SelectedRoles
            this.adminService.editRoles(user.userName,selectedRoles).subscribe({
              next: roles => user.roles =roles
            })
          }
        }
      })
    }

  loadUsers() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) =>
      (this.users = users),
    });
  }


  printUser() {
    // console.log(this.users)
  }
}
