import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { AngularMaterialModule } from '../angular-material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';

import { LayoutRoutingModule } from './layout-routing.module';

import { RouterModule } from '@angular/router';
import { WrapperComponent } from './wrapper/wrapper.component';
import { HomeComponent } from './views/user/user_home/home/home.component';
import { ProjectsComponent } from './views/user/user_projects/projects/projects.component';
import { TeamsComponent } from './views/user/user_teams/teams/teams.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { LoginComponent } from './auth/login/login.component';
import { AdDashboardComponent } from './views/admin/manager/addashboard/ad-dashboard/ad-dashboard.component';
import { AdProjectsComponent } from './views/admin/manager/adprojects/ad-projects/ad-projects.component';
import { AdTeamsComponent } from './views/admin/manager/adteams/ad-teams/ad-teams.component';
import { NewProjectModalComponent } from './views/admin/manager/adprojects/new-projectmodal/new-projectmodal.component';
import { TeamInfoComponent } from './views/admin/manager/adteams/team-info/team-info.component';
import { AddMemberComponent } from './views/admin/manager/adteams/add-member/add-member.component';
import { AssignProjectComponent } from './views/admin/manager/adteams/assign-project/assign-project.component';
import { ScheduleComponent } from './views/user/user_projects/schedule/schedule.component';
import { UsTeamInfoComponent } from './views/user/user_teams/us-team-info/us-team-info.component';
import { ProjectInfoComponent } from './views/user/user_projects/project-info/project-info.component';
import { AdProjectInfoComponent } from './views/admin/manager/adprojects/ad-project-info/ad-project-info.component';
import { ProjectActionComponent } from './views/user/user_projects/project-action/project-action.component';
/**Filters imported below */
import {
  MyFilterPipe,
  ProjectFilterPipe,
  TeamFilterPipe,
  UserFilterPipe,
} from '../filter.pipe';
import { ProjectStatusComponent } from './views/admin/manager/addashboard/project-status/project-status.component';
import { ActiveSessionsComponent } from './views/admin/manager/addashboard/active-sessions/active-sessions.component';
import { RecentSessionsComponent } from './views/admin/manager/addashboard/recent-sessions/recent-sessions.component';
import { DispositionComponent } from './views/user/user_projects/disposition/disposition.component';
import { UserStatusComponent } from './views/admin/manager/addashboard/user-status/user-status.component';
import { ManageComponent } from './views/admin/manager/manage/manage/manage.component';
import { MngUsersComponent } from './views/admin/manager/manage/users/mng-users/mng-users.component';
import { MngProjectsComponent } from './views/admin/manager/manage/projects/mng-projects/mng-projects.component';
import { MngTeamsComponent } from './views/admin/manager/manage/teams/mng-teams/mng-teams.component';
import { MngSessionsComponent } from './views/admin/manager/manage/sessions/mng-sessions/mng-sessions.component';
import { NewUsermodalComponent } from './views/admin/manager/manage/users/new-usermodal/new-usermodal.component';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { EditUsermodalComponent } from './views/admin/manager/manage/users/edit-usermodal/edit-usermodal.component';
import { SessionsComponent } from './views/user/user_sessions/sessions/sessions.component';
import { ProjectTeamsComponent } from './views/admin/manager/adprojects/project-teams/project-teams.component';
import { UserProfileComponent } from './views/user/user-profile/user-profile.component';
import { ProjSessionsComponent } from './views/user/user_projects/proj-sessions/proj-sessions.component';
import { AdProjSessionsComponent } from './views/admin/manager/adprojects/ad-proj-sessions/ad-proj-sessions.component';
import { TeamSupervisorComponent } from './views/admin/manager/adteams/team-supervisor/team-supervisor.component';
import { UserInfoComponent } from './views/admin/manager/manage/users/user-info/user-info.component';
import { AssignSupervisorComponent } from './views/admin/manager/adteams/assign-supervisor/assign-supervisor.component';
import { SuperviseMainPageComponent } from './views/admin/supervisor/supervise-main-page/supervise-main-page.component';
import { SuperviseTeamPageComponent } from './views/admin/supervisor/supervise-team-page/supervise-team-page.component';
import { SuperviseEarningPageComponent } from './views/admin/supervisor/supervise-earning-page/supervise-earning-page.component';
import { EditProjectmodalComponent } from './views/admin/manager/adprojects/edit-projectmodal/edit-projectmodal.component';
import { EditTeammodalComponent } from './views/admin/manager/adteams/edit-teammodal/edit-teammodal.component';
import { NewTeammodalComponent } from './views/admin/manager/adteams/new-teammodal/new-teammodal.component';
import { MngEarningsComponent } from './views/admin/manager/manage/earnings/mng-earnings/mng-earnings.component';
import { AdminTeamsComponent } from './views/admin/manager/adteams/admin-teams/admin-teams.component';
import { AdProjectInfoModalComponent } from './views/admin/manager/adprojects/ad-project-info-modal/ad-project-info-modal.component';

@NgModule({
  declarations: [
    /*helper components*/
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidenavComponent,
    WrapperComponent,

    /*user components declarations*/
    HomeComponent,
    ProjectsComponent,
    TeamsComponent,

    /*auth component declarations*/
    LogHeaderComponent,
    LoginComponent,

    /*admin component declarations*/
    AdDashboardComponent,
    AdProjectsComponent,
    AdTeamsComponent,
    NewProjectModalComponent,
    EditProjectmodalComponent,
    EditTeammodalComponent,
    NewTeammodalComponent,
    TeamInfoComponent,
    AddMemberComponent,
    AssignProjectComponent,
    ScheduleComponent,
    UsTeamInfoComponent,
    ProjectInfoComponent,
    AdProjectInfoComponent,
    ProjectActionComponent,
    ProjectStatusComponent,
    ActiveSessionsComponent,
    RecentSessionsComponent,

    /**added filter pipe to use it inside a component to filter*/
    ProjectFilterPipe,
    TeamFilterPipe,
    UserFilterPipe,
    MyFilterPipe,
    DispositionComponent,
    UserStatusComponent,
    ManageComponent,
    MngUsersComponent,
    MngProjectsComponent,
    MngTeamsComponent,
    MngSessionsComponent,
    NewUsermodalComponent,
    EditUsermodalComponent,
    SessionsComponent,
    ProjectTeamsComponent,
    UserProfileComponent,
    ProjSessionsComponent,
    AdProjSessionsComponent,
    TeamSupervisorComponent,
    UserInfoComponent,
    AssignSupervisorComponent,
    SuperviseMainPageComponent,
    SuperviseTeamPageComponent,
    SuperviseEarningPageComponent,
    MngEarningsComponent,
    AdminTeamsComponent,
    AdProjectInfoModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SelectDropDownModule,

    /*material imports*/
    AngularMaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    MdbDropdownModule,
    MdbFormsModule,

    /**mdb modals */
    MdbModalModule,
  ],
})
export class MyLayoutModule {}
