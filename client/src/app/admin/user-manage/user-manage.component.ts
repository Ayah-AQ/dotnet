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

  
    createRoleModule(){
      const initialState: ModalOptions ={
        class: 'modal-lg',
        initialState:{
          title: 'User roles',
          list:['Admin', 'Moderator',"Member"]
        }
      }
      this.bsModalRef= this.modalService.show(RolesModalComponent,initialState)
    }

  loadUsers() {
    this.adminService.getUsersWithRoles().subscribe({
      next: (users) =>
        // console.log(users)

        (this.users = users),
    });
  }


  printUser() {
    // console.log(this.users)
  }
}
