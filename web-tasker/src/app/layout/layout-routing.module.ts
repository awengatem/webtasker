import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './components/user/user_projects/projects/projects.component';
import { HomeComponent } from './components/user/user_home/home/home.component';
import { TeamsComponent } from './components/user/user_teams/teams/teams.component';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { LoginComponent } from './auth/login/login.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { AuthGuard } from '../helpers/guards/auth-guard.guard';
import { AdDashboardComponent } from './components/admin/addashboard/ad-dashboard/ad-dashboard.component';
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
import { ProjectInfoComponent } from './components/user/user_projects/project-info/project-info.component';
import { AdProjectInfoComponent } from './components/admin/adprojects/ad-project-info/ad-project-info.component';
import { SocketTestComponent } from './components/admin/socket-test/socket-test.component';
import { ProjectActionComponent } from './components/user/user_projects/project-action/project-action.component';
import { TimerGuard } from '../helpers/guards/timer.guard';
import { ManagerGuard } from '../helpers/guards/manager.guard';
import { ProjectStatusComponent } from './components/admin/addashboard/project-status/project-status.component';
import { ActiveSessionsComponent } from './components/admin/addashboard/active-sessions/active-sessions.component';
import { DispositionComponent } from './components/user/user_projects/disposition/disposition.component';
import { RecentSessionsComponent } from './components/admin/addashboard/recent-sessions/recent-sessions.component';
import { UserStatusComponent } from './components/admin/addashboard/user-status/user-status.component';
import { ManageComponent } from './components/admin/manage/manage/manage.component';
import { MngUsersComponent } from './components/admin/manage/users/mng-users/mng-users.component';
import { MngProjectsComponent } from './components/admin/manage/projects/mng-projects/mng-projects.component';
import { MngTeamsComponent } from './components/admin/manage/teams/mng-teams/mng-teams.component';
import { MngSessionsComponent } from './components/admin/manage/sessions/mng-sessions/mng-sessions.component';
import { CanDeactivateGuard } from '../helpers/guards/canDeactivate.guard';
import { SupervisorGuard } from '../helpers/guards/supervisor.guard';
import { SessionsComponent } from './components/user/user_sessions/sessions/sessions.component';
import { ClearLocationGuard } from '../helpers/guards/clear-location.guard';

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
      {
        path: 'projects/:projectId/:teamId',
        canActivate: [AuthGuard],
        component: ProjectInfoComponent,
      },
      {
        path: 'projects/:projectId/action',
        canActivate: [AuthGuard, TimerGuard],
        component: ProjectActionComponent,
      },
      {
        path: 'projects/:projectId/action/disposition',
        canActivate: [AuthGuard, TimerGuard],
        component: DispositionComponent,
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

      /**SESSIONS */
      {
        path: 'sessions',
        canActivate: [AuthGuard],
        component: SessionsComponent,
      },

      /**ADMIN ROUTES */
      /**DASHBOARD */
      {
        path: 'ad_dashboard',
        canActivate: [AuthGuard, SupervisorGuard],
        canDeactivate: [CanDeactivateGuard],
        component: AdDashboardComponent,
      },

      {
        path: 'project_status',
        canActivate: [AuthGuard, SupervisorGuard],
        component: ProjectStatusComponent,
      },

      {
        path: 'active_sessions',
        canActivate: [AuthGuard, SupervisorGuard],
        component: ActiveSessionsComponent,
      },

      {
        path: 'recent_sessions',
        canActivate: [AuthGuard, SupervisorGuard],
        component: RecentSessionsComponent,
      },

      {
        path: 'user_status',
        canActivate: [AuthGuard, SupervisorGuard],
        component: UserStatusComponent,
      },

      /**PROJECTS */
      {
        path: 'ad_projects',
        canActivate: [AuthGuard, SupervisorGuard],
        component: AdProjectsComponent,
      },
      {
        path: 'ad_projects/:projectId',
        canActivate: [AuthGuard, SupervisorGuard],
        component: AdProjectInfoComponent,
      },
      {
        path: 'new_project',
        canActivate: [AuthGuard, SupervisorGuard],
        canDeactivate: [ClearLocationGuard],
        component: NewProjectComponent,
      },
      {
        path: 'edit_project/:projectId',
        canActivate: [AuthGuard, SupervisorGuard],
        canDeactivate: [ClearLocationGuard],
        component: EditProjectComponent,
      },

      /**TEAMS */
      {
        path: 'ad_teams',
        canActivate: [AuthGuard, SupervisorGuard],
        component: AdTeamsComponent,
      },
      {
        path: 'ad_teams/:teamId',
        canActivate: [AuthGuard, SupervisorGuard],
        component: TeamInfoComponent,
      },
      {
        path: 'ad_teams/:teamId/add_member',
        canActivate: [AuthGuard, SupervisorGuard],
        component: AddMemberComponent,
      },
      {
        path: 'ad_teams/:teamId/assign_project',
        canActivate: [AuthGuard, SupervisorGuard],
        component: AssignProjectComponent,
      },
      {
        path: 'new_team',
        canActivate: [AuthGuard, SupervisorGuard],
        canDeactivate: [ClearLocationGuard],
        component: NewTeamComponent,
      },
      {
        path: 'edit_team/:teamId',
        canActivate: [AuthGuard, SupervisorGuard],
        canDeactivate: [ClearLocationGuard],
        component: EditTeamComponent,
      },

      /**MANAGE*/
      {
        path: 'ad_manage',
        canActivate: [AuthGuard, ManagerGuard],
        component: ManageComponent,
      },
      {
        path: 'ad_manage/users',
        canActivate: [AuthGuard, ManagerGuard],
        component: MngUsersComponent,
      },
      {
        path: 'ad_manage/projects',
        canActivate: [AuthGuard, ManagerGuard],
        component: MngProjectsComponent,
      },
      {
        path: 'ad_manage/teams',
        canActivate: [AuthGuard, ManagerGuard],
        component: MngTeamsComponent,
      },
      {
        path: 'ad_manage/sessions',
        canActivate: [AuthGuard, ManagerGuard],
        component: MngSessionsComponent,
      },

      /**TESTING PURPOSE */
      {
        path: 'socketTest',
        canActivate: [AuthGuard, SupervisorGuard],
        component: SocketTestComponent,
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
