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
import { ClearDashintervalGuard } from '../helpers/guards/clear-dashinterval.guard';
import { SupervisorGuard } from '../helpers/guards/supervisor.guard';
import { SessionsComponent } from './components/user/user_sessions/sessions/sessions.component';
import { ClearLocationGuard } from '../helpers/guards/clear-location.guard';
import { ProjectTeamsComponent } from './components/admin/adprojects/project-teams/project-teams.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { ClearUsessionsintervalGuard } from '../helpers/guards/clear-usessionsinterval.guard';
import { ProjSessionsComponent } from './components/user/user_projects/proj-sessions/proj-sessions.component';
import { AdProjSessionsComponent } from './components/admin/adprojects/ad-proj-sessions/ad-proj-sessions.component';
import { TeamSupervisorComponent } from './components/admin/adteams/team-supervisor/team-supervisor.component';
import { UserInfoComponent } from './components/admin/manage/users/user-info/user-info.component';
import { AssignSupervisorComponent } from './components/admin/adteams/assign-supervisor/assign-supervisor.component';
import { SuperviseTeamPageComponent } from './components/admin/supervise/supervise-team-page/supervise-team-page.component';
import { SuperviseEarningPageComponent } from './components/admin/supervise/supervise-earning-page/supervise-earning-page.component';
import { SuperviseMainPageComponent } from './components/admin/supervise/supervise-main-page/supervise-main-page.component';
import { AdminGuard } from '../helpers/guards/admin.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: WrapperComponent,
    canActivate: [AuthGuard],
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
        component: HomeComponent,
      },

      /**PROJECTS */
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'projects/:projectId/:teamId',
        component: ProjectInfoComponent,
      },
      {
        path: 'projects/:projectId/:teamId/sessions',
        component: ProjSessionsComponent,
      },
      {
        path: 'projects/:projectId/:teamId/action',
        canActivate: [TimerGuard],
        component: ProjectActionComponent,
      },
      {
        path: 'projects/:projectId/:teamId/disposition',
        canActivate: [TimerGuard],
        component: DispositionComponent,
      },

      /**TEAMS */
      {
        path: 'teams',
        component: TeamsComponent,
      },
      {
        path: 'teams/:teamId',
        component: UsTeamInfoComponent,
      },

      /**SESSIONS */
      {
        path: 'sessions',
        canDeactivate: [ClearUsessionsintervalGuard],
        component: SessionsComponent,
      },

      /**PROFILE */
      {
        path: 'profile',
        component: UserProfileComponent,
      },

      /**ADMIN ROUTES */
      /**DASHBOARD */
      {
        path: 'ad_dashboard',
        canActivate: [ManagerGuard],
        canDeactivate: [ClearDashintervalGuard],
        component: AdDashboardComponent,
      },

      {
        path: 'ad_dashboard/project_status',
        canActivate: [ManagerGuard],
        component: ProjectStatusComponent,
      },

      {
        path: 'ad_dashboard/active_sessions',
        canActivate: [ManagerGuard],
        component: ActiveSessionsComponent,
      },

      {
        path: 'ad_dashboard/recent_sessions',
        canActivate: [ManagerGuard],
        component: RecentSessionsComponent,
      },

      {
        path: 'ad_dashboard/user_status',
        canActivate: [ManagerGuard],
        component: UserStatusComponent,
      },

      /**PROJECTS */
      {
        path: 'ad_projects',
        canActivate: [AdminGuard],
        component: AdProjectsComponent,
      },
      {
        path: 'ad_projects/:projectId',
        canActivate: [AdminGuard],
        canDeactivate: [ClearLocationGuard],
        component: AdProjectInfoComponent,
      },
      {
        path: 'ad_projects/:projectId/sessions',
        canActivate: [AdminGuard],
        component: AdProjSessionsComponent,
      },
      {
        path: 'project_teams/:projectId',
        canActivate: [AdminGuard],
        component: ProjectTeamsComponent,
      },

      /**TEAMS */
      {
        path: 'ad_teams',
        canActivate: [AdminGuard],
        component: AdTeamsComponent,
      },
      {
        path: 'ad_teams/:teamId',
        canActivate: [AdminGuard],
        canDeactivate: [ClearLocationGuard],
        component: TeamInfoComponent,
      },
      {
        path: 'ad_teams/:teamId/add_member',
        canActivate: [AdminGuard],
        component: AddMemberComponent,
      },
      {
        path: 'ad_teams/:teamId/assign_project',
        canActivate: [AdminGuard],
        component: AssignProjectComponent,
      },
      {
        path: 'ad_teams/:teamId/supervisor',
        canActivate: [AdminGuard],
        component: TeamSupervisorComponent,
      },
      {
        path: 'ad_teams/:teamId/assign_supervisor',
        canActivate: [AdminGuard],
        component: AssignSupervisorComponent,
      },

      /**SUPERVISE*/
      {
        path: 'supervise',
        canActivate: [SupervisorGuard],
        component: SuperviseMainPageComponent,
      },
      {
        path: 'supervise/team',
        canActivate: [SupervisorGuard],
        component: SuperviseTeamPageComponent,
      },
      {
        path: 'supervise/earnings',
        canActivate: [SupervisorGuard],
        component: SuperviseEarningPageComponent,
      },

      /**MANAGE*/
      {
        path: 'ad_manage',
        canActivate: [ManagerGuard],
        component: ManageComponent,
      },
      {
        path: 'ad_manage/users',
        canActivate: [ManagerGuard],
        component: MngUsersComponent,
      },
      {
        path: 'ad_manage/user_info',
        canActivate: [ManagerGuard],
        component: UserInfoComponent,
      },
      {
        path: 'ad_manage/projects',
        canActivate: [ManagerGuard],
        component: MngProjectsComponent,
      },
      {
        path: 'ad_manage/teams',
        canActivate: [ManagerGuard],
        component: MngTeamsComponent,
      },
      {
        path: 'ad_manage/sessions',
        canActivate: [ManagerGuard],
        component: MngSessionsComponent,
      },

      /**TESTING PURPOSE */
      {
        path: 'socketTest',
        canActivate: [AdminGuard],
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
