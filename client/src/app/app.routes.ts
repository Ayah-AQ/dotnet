import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorsComponent } from './errors/server-errors/server-errors.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsvedChangesGuard } from './_guards/prevent-unsved-changes.guard';
import { ListComponent } from './List/list.component';
import { MessageComponent } from './members/message/message.component';
import { memberDetailedResolver } from './_resolver/member-detailed.resolver';
import { AdminPanalComponent } from './admin/admin-panal/admin-panal.component';
import { adminGuard } from './_guards/admin.guard';


export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: '', 
    runGuardsAndResolvers:'always',
    canActivate:[authGuard],
    children:[
    {path: 'members', component:MemberListComponent},
    {path: 'lists', component:ListComponent},
    {path: 'members/edit', component:MemberEditComponent, canDeactivate: [preventUnsvedChangesGuard]},
    {path: 'members/:username', component:MemberDetailComponent, resolve:{member:memberDetailedResolver}},
    {path: 'messages', component:MessagesComponent},
    {path: 'messages/:username', component:MessageComponent},
    {path: 'admin', component:AdminPanalComponent, canActivate:[adminGuard] },
    ]},
    {path: 'signup', component:RegisterComponent},
    {path: 'errors', component:TestErrorsComponent},
    {path: 'not-found', component:NotFoundComponent},
    {path: 'server-error', component:ServerErrorsComponent},
    {path: '**', component:HomeComponent, pathMatch:'full'}, 
];
