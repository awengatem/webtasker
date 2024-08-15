import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './views/user/user_projects/projects/projects.component';
import { HomeComponent } from './views/user/user_home/home/home.component';
import { TeamsComponent } from './views/user/user_teams/teams/teams.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { LoginComponent } from './auth/login/login.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { AuthGuard } from '../helpers/guards/auth-guard.guard';
import { AdDashboardComponent } from './views/admin/addashboard/ad-dashboard/ad-dashboard.component';
import { AdProjectsComponent } from './views/admin/adprojects/ad-projects/ad-projects.component';
import { AdTeamsComponent } from './views/admin/adteams/ad-teams/ad-teams.component';
import { TeamInfoComponent } from './views/admin/adteams/team-info/team-info.component';
import { AddMemberComponent } from './views/admin/adteams/add-member/add-member.component';
import { AssignProjectComponent } from './views/admin/adteams/assign-project/assign-project.component';
import { UsTeamInfoComponent } from './views/user/user_teams/us-team-info/us-team-info.component';
import { ProjectInfoComponent } from './views/user/user_projects/project-info/project-info.component';
import { AdProjectInfoComponent } from './views/admin/adprojects/ad-project-info/ad-project-info.component';
import { ProjectActionComponent } from './views/user/user_projects/project-action/project-action.component';
import { TimerGuard } from '../helpers/guards/timer.guard';
import { AdminGuard } from '../helpers/guards/admin.guard';
import { ProjectStatusComponent } from './views/admin/addashboard/project-status/project-status.component';
import { ActiveSessionsComponent } from './views/admin/addashboard/active-sessions/active-sessions.component';
import { DispositionComponent } from './views/user/user_projects/disposition/disposition.component';
import { RecentSessionsComponent } from './views/admin/addashboard/recent-sessions/recent-sessions.component';
import { UserStatusComponent } from './views/admin/addashboard/user-status/user-status.component';
import { ManageComponent } from './views/admin/manage/manage/manage.component';
import { MngProjectsComponent } from './views/admin/manage/projects/mng-projects/mng-projects.component';
import { MngUsersComponent } from './views/admin/manage/users/mng-users/mng-users.component';
import { MngTeamsComponent } from './views/admin/manage/teams/mng-teams/mng-teams.component';
import { MngSessionsComponent } from './views/admin/manage/sessions/mng-sessions/mng-sessions.component';
import { ClearDashintervalGuard } from '../helpers/guards/clear-dashinterval.guard';
import { SupervisorGuard } from '../helpers/guards/supervisor.guard';
import { SessionsComponent } from './views/user/user_sessions/sessions/sessions.component';
import { ClearLocationGuard } from '../helpers/guards/clear-location.guard';
import { ProjectTeamsComponent } from './views/admin/adprojects/project-teams/project-teams.component';
import { UserProfileComponent } from './views/user/user-profile/user-profile.component';
import { ClearUsessionsintervalGuard } from '../helpers/guards/clear-usessionsinterval.guard';
import { ProjSessionsComponent } from './views/user/user_projects/proj-sessions/proj-sessions.component';
import { AdProjSessionsComponent } from './views/admin/adprojects/ad-proj-sessions/ad-proj-sessions.component';
import { TeamSupervisorComponent } from './views/admin/adteams/team-supervisor/team-supervisor.component';
import { UserInfoComponent } from './views/admin/manage/users/user-info/user-info.component';
import { AssignSupervisorComponent } from './views/admin/adteams/assign-supervisor/assign-supervisor.component';
import { SuperviseTeamPageComponent } from './views/supervisor/supervise-team-page/supervise-team-page.component';
import { SuperviseEarningPageComponent } from './views/supervisor/supervise-earning-page/supervise-earning-page.component';
import { SuperviseMainPageComponent } from './views/supervisor/supervise-main-page/supervise-main-page.component';
import { MngEarningsComponent } from './views/admin/manage/earnings/mng-earnings/mng-earnings.component';
import { AdminTeamsComponent } from './views/admin/adteams/admin-teams/admin-teams.component';
import { SuperviseTeamsComponent } from './views/supervisor/supervise-teams/supervise-teams.component';
import { SuperviseProjectsComponent } from './views/supervisor/supervise-projects/supervise-projects.component';
import { AdminSupervisorGuard } from '../helpers/guards/adminSupervisor.guard';
import { PreviousRouteGuard } from '../helpers/guards/previous-route.guard';
import { SuperviseTeaminfoComponent } from './views/supervisor/supervise-teaminfo/supervise-teaminfo.component';

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
        path: 'projects/:projectId/info',
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

      /*** SUPERVISOR ROUTES ***/
      {
        path: 'supervise',
        canActivate: [SupervisorGuard],
        component: SuperviseMainPageComponent,
      },
      {
        path: 'supervise/team',
        canActivate: [SupervisorGuard],
        canDeactivate: [PreviousRouteGuard],
        component: SuperviseTeamPageComponent,
      },
      {
        path: 'supervise/earnings',
        canActivate: [SupervisorGuard],
        component: SuperviseEarningPageComponent,
      },

      /**PROJECTS */
      {
        path: 'sup_projects',
        canActivate: [SupervisorGuard],
        canDeactivate: [PreviousRouteGuard],
        component: SuperviseProjectsComponent,
      },

      /**TEAMS */
      {
        path: 'sup_teams',
        canActivate: [SupervisorGuard],
        component: SuperviseTeamsComponent,
      },
      {
        path: 'sup_teams/:teamId',
        canActivate: [SupervisorGuard],
        component: SuperviseTeaminfoComponent,
      },

      /*** ADMIN ROUTES ***/
      /**DASHBOARD */
      {
        path: 'ad_dashboard',
        canActivate: [AdminGuard],
        canDeactivate: [ClearDashintervalGuard],
        component: AdDashboardComponent,
      },

      {
        path: 'ad_dashboard/project_status',
        canActivate: [AdminGuard],
        component: ProjectStatusComponent,
      },

      {
        path: 'ad_dashboard/active_sessions',
        canActivate: [AdminGuard],
        component: ActiveSessionsComponent,
      },

      {
        path: 'ad_dashboard/recent_sessions',
        canActivate: [AdminGuard],
        component: RecentSessionsComponent,
      },

      {
        path: 'ad_dashboard/user_status',
        canActivate: [AdminGuard],
        component: UserStatusComponent,
      },

      /**PROJECTS */
      {
        path: 'ad_projects',
        canActivate: [AdminGuard],
        canDeactivate: [PreviousRouteGuard],
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
        canActivate: [AdminSupervisorGuard], //allow admin & supervisor
        component: ProjectTeamsComponent,
      },

      /**TEAMS */
      {
        path: 'ad_teams',
        canActivate: [AdminGuard],
        component: AdTeamsComponent,
      },
      {
        path: 'admin_teams',
        canActivate: [AdminGuard],
        component: AdminTeamsComponent,
      },
      {
        path: 'ad_teams/:teamId',
        canActivate: [AdminGuard],
        canDeactivate: [ClearLocationGuard, PreviousRouteGuard],
        component: TeamInfoComponent,
      },
      {
        path: 'ad_teams/:teamId/add_member',
        canActivate: [AdminSupervisorGuard], //allow admin & supervisor
        component: AddMemberComponent,
      },
      {
        path: 'ad_teams/:teamId/assign_project',
        canActivate: [AdminSupervisorGuard], //allow admin & supervisor
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

      /**MANAGE*/
      {
        path: 'ad_manage',
        canActivate: [AdminGuard],
        component: ManageComponent,
      },
      {
        path: 'ad_manage/users',
        canActivate: [AdminGuard],
        component: MngUsersComponent,
      },
      {
        path: 'ad_manage/user_info',
        canActivate: [AdminGuard],
        component: UserInfoComponent,
      },
      {
        path: 'ad_manage/projects',
        canActivate: [AdminGuard],
        component: MngProjectsComponent,
      },
      {
        path: 'ad_manage/teams',
        canActivate: [AdminGuard],
        component: MngTeamsComponent,
      },
      {
        path: 'ad_manage/sessions',
        canActivate: [AdminGuard],
        component: MngSessionsComponent,
      },
      {
        path: 'ad_manage/earnings',
        canActivate: [AdminGuard],
        component: MngEarningsComponent,
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
