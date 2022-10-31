import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { AngularMaterialModule } from '../angular-material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';

import { LayoutRoutingModule } from './layout-routing.module';

import { RouterModule } from '@angular/router';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { HomeComponent } from './components/user/user_home/home/home.component';
import { ProjectsComponent } from './components/user/user_projects/projects/projects.component';
import { TeamsComponent } from './components/user/user_teams/teams/teams.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdDashboardComponent } from './components/admin/addashboard/ad-dashboard/ad-dashboard.component';
import { AdProjectsComponent } from './components/admin/adprojects/ad-projects/ad-projects.component';
import { AdTeamsComponent } from './components/admin/adteams/ad-teams/ad-teams.component';
import { NewProjectComponent } from './components/admin/adprojects/new-project/new-project.component';
import { EditProjectComponent } from './components/admin/adprojects/edit-project/edit-project.component';
import { EditTeamComponent } from './components/admin/adteams/edit-team/edit-team.component';
import { NewTeamComponent } from './components/admin/adteams/new-team/new-team.component';
import { TeamInfoComponent } from './components/admin/adteams/team-info/team-info.component';
import { AddMemberComponent } from './components/admin/adteams/add-member/add-member.component';
import { AssignProjectComponent } from './components/admin/adteams/assign-project/assign-project.component';
import { ScheduleComponent } from './components/user/user_projects/schedule/schedule.component';
import { UsTeamInfoComponent } from './components/user/user_teams/us-team-info/us-team-info.component';
import { ProjectInfoComponent } from './components/user/user_projects/project-info/project-info.component';
import { AdProjectInfoComponent } from './components/admin/adprojects/ad-project-info/ad-project-info.component';
import { SocketTestComponent } from './components/admin/socket-test/socket-test.component';
import { ProjectActionComponent } from './components/user/user_projects/project-action/project-action.component';
/**Filters imported below */
import {
  ProjectFilterPipe,
  TeamFilterPipe,
  UserFilterPipe,
} from '../filter.pipe';

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
    RegisterComponent,

    /*admin component declarations*/
    AdDashboardComponent,
    AdProjectsComponent,
    AdTeamsComponent,
    NewProjectComponent,
    EditProjectComponent,
    EditTeamComponent,
    NewTeamComponent,
    TeamInfoComponent,
    AddMemberComponent,
    AssignProjectComponent,
    ScheduleComponent,
    UsTeamInfoComponent,
    ProjectInfoComponent,
    AdProjectInfoComponent,
    SocketTestComponent,
    ProjectActionComponent,

    /**added filter pipe to use it inside a component to filter*/
    ProjectFilterPipe,
    TeamFilterPipe,
    UserFilterPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    /*material imports*/
    AngularMaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    MdbDropdownModule,
  ], 
})
export class MyLayoutModule {}
