import { Component } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HasRoleDirective } from '../../_directive/has-role.directive';
import { PhotoManageComponent } from "../photo-manage/photo-manage.component";
import { UserManageComponent } from "../user-manage/user-manage.component";

@Component({
  selector: 'app-admin-panal',
  standalone: true,
  imports: [TabsModule, HasRoleDirective, PhotoManageComponent, UserManageComponent],
  templateUrl: './admin-panal.component.html',
  styleUrl: './admin-panal.component.scss'
})
export class AdminPanalComponent {

}
