import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './components/user/projects/projects.component';
import { HomeComponent } from './components/user/home/home.component';
import { TeamsComponent } from './components/user/teams/teams.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { LoginComponent } from './auth/login/login.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { AuthGuard } from '../helpers/auth-guard.guard';
import { AdDashboardComponent } from './components/admin/ad-dashboard/ad-dashboard.component';
import { AdProjectsComponent } from './components/admin/ad-projects/ad-projects.component';
import { AdTeamsComponent } from './components/admin/ad-teams/ad-teams.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: WrapperComponent,
    //component: LoginComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeComponent,
      },
      {
        path: 'projects',
        canActivate: [AuthGuard],
        component: ProjectsComponent,
      },
      {
        path: 'teams',
        canActivate: [AuthGuard],
        component: TeamsComponent,
      },

      /**ADMIN ROUTES */
      {
        path: 'ad_dashboard',
        canActivate: [AuthGuard],
        component: AdDashboardComponent,
      },
      {
        path: 'ad_projects',
        canActivate: [AuthGuard],
        component: AdProjectsComponent,
      },
      {
        path: 'ad_teams',
        canActivate: [AuthGuard],
        component: AdTeamsComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home', //add "page not found" component
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}

//remember to add redirect tomorrow
