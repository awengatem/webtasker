import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './components/user/projects/projects.component';
import { HomeComponent } from './components/user/home/home.component';
import { UsersComponent } from './components/user/users/users.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { LoginComponent } from './auth/login/login.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { AuthGuard } from '../helpers/auth-guard.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path:'',
    component: WrapperComponent,
    //component: LoginComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeComponent
      },
      {
        path: 'projects',
        canActivate: [AuthGuard],
        component: ProjectsComponent
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        component: UsersComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home',//add "page not found" component
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }

//remember to add redirect tomorrow