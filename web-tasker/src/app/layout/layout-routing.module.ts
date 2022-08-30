import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './components/user/user_projects/projects/projects.component';
import { HomeComponent } from './components/user/user_home/home/home.component';
import { TeamsComponent } from './components/user/user_teams/teams/teams.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { LoginComponent } from './auth/login/login.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { AuthGuard } from '../helpers/auth-guard.guard';
import { AdDashboardComponent } from './components/admin/ad-dashboard/ad-dashboard.component';
import { AdProjectsComponent } from './components/admin/adprojects/ad-projects/ad-projects.component';
import { AdTeamsComponent } from './components/admin/adteams/ad-teams/ad-teams.component';
import { NewProjectComponent } from './components/admin/adprojects/new-project/new-project.component';
import { EditProjectComponent } from './components/admin/adprojects/edit-project/edit-project.component';
import { NewTeamComponent } from './components/admin/adteams/new-team/new-team.component';
import { EditTeamComponent } from './components/admin/adteams/edit-team/edit-team.component';
import { TeamInfoComponent } from './components/admin/adteams/team-info/team-info.component';
import { AddMemberComponent } from './components/admin/adteams/add-member/add-member.component';
import { AssignProjectComponent } from './components/admin/adteams/assign-project/assign-project.component';
import { UsTeamInfoComponent } from './components/user/user_teams/us-team-info/us-team-info.component';

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

      /**USER ROUTES */
      /**DASHBOARD */
      {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeComponent,
      },

      /**PROJECTS */
      {
        path: 'projects',
        canActivate: [AuthGuard],
        component: ProjectsComponent,
      },

       /**TEAMS */
      {
        path: 'teams',
        canActivate: [AuthGuard],
        component: TeamsComponent,
      },
      {
        path: 'teams/:teamId',
        canActivate: [AuthGuard],
        component: UsTeamInfoComponent,
      },

      /**ADMIN ROUTES */
      /**DASHBOARD */
      {
        path: 'ad_dashboard',
        canActivate: [AuthGuard],
        component: AdDashboardComponent,
      },

      /**PROJECTS */
      {
        path: 'ad_projects',
        canActivate: [AuthGuard],
        component: AdProjectsComponent,
      }, 
      {
        path: 'ad_projects/:projectId',
        canActivate: [AuthGuard],
        component: AdProjectsComponent,
      },
      {
        path: 'new_project',
        canActivate: [AuthGuard],
        component: NewProjectComponent,
      },
      {
        path: 'edit_project/:projectId',
        canActivate: [AuthGuard],
        component: EditProjectComponent,
      },

      /**TEAMS */
      {
        path: 'ad_teams',
        canActivate: [AuthGuard],
        component: AdTeamsComponent,
      },
      {
        path: 'ad_teams/:teamId',
        canActivate: [AuthGuard],
        component: TeamInfoComponent,
      },
      {
        path: 'ad_teams/:teamId/add_member',
        canActivate: [AuthGuard],
        component: AddMemberComponent,
      },
      {
        path: 'ad_teams/:teamId/assign_project',
        canActivate: [AuthGuard],
        component: AssignProjectComponent,
      },
      {
        path: 'new_team',
        canActivate: [AuthGuard],
        component: NewTeamComponent,
      },
      {
        path: 'edit_team/:teamId',
        canActivate: [AuthGuard],
        component: EditTeamComponent,
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
