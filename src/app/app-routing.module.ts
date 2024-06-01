import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { MenusidebarComponent } from './menusidebar/menusidebar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { GestionClientsComponent } from './Contacts/gestion-clients.component';
import { ProspectsComponent } from './prospects/prospects.component';
import { GestionTaskComponent } from './Tasks/gestion-task/gestion-task.component';
import { authGuard } from './token/auth.guard';
import { DashbordComponent } from './dashbord/dashbord.component';
import { StatisticComponent } from './statistic/statistic.component';
import { CalendrierComponent } from './calendrier/calendrier.component';
import { PermissionComponent } from './permission/permission.component';
import { GestionRolesComponent } from './role/gestion-roles/gestion-roles.component';




const routes: Routes = [
  
    {path: 'login', component: AuthentificationComponent},
    {path:'dashboad',component:DashbordComponent,canActivate : [authGuard],
    children : [
      {path: 'footer', component:FooterComponent,canActivate : [authGuard]},
      {path: 'navbar', component:NavBarComponent,canActivate : [authGuard]},
      {path: 'sidebar', component:MenusidebarComponent,canActivate : [authGuard]},
      {path: 'contact', component:GestionClientsComponent,canActivate : [authGuard]},
      {path: 'prospect', component:ProspectsComponent,canActivate : [authGuard]},
      {path: 'tasks', component:GestionTaskComponent,canActivate : [authGuard]},
      {path: 'statistic', component:StatisticComponent,canActivate : [authGuard]},
      {path: 'calendrier', component:CalendrierComponent,canActivate : [authGuard]},
      {path: 'permission', component:PermissionComponent,canActivate : [authGuard]},
      {path: 'role', component:GestionRolesComponent,canActivate : [authGuard]}

    ]

    }
   
    
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
