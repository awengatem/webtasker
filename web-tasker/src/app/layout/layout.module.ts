import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { AngularMaterialModule } from '../angular-material.module';

import { LayoutRoutingModule } from './layout-routing.module';

import { RouterModule } from '@angular/router';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { HomeComponent } from './components/user/home/home.component';
import { ProjectsComponent } from './components/user/projects/projects.component';
import { TeamsComponent } from './components/user/teams/teams.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdDashboardComponent } from './components/admin/ad-dashboard/ad-dashboard.component';
import { AdProjectsComponent } from './components/admin/adprojects/ad-projects/ad-projects.component';
import { AdTeamsComponent } from './components/admin/adteams/ad-teams/ad-teams.component';
import { NewProjectComponent } from './components/admin/adprojects/new-project/new-project.component';
import { EditProjectComponent } from './components/admin/adprojects/edit-project/edit-project.component';
import { EditTeamComponent } from './components/admin/adteams/edit-team/edit-team.component';
import { NewTeamComponent } from './components/admin/adteams/new-team/new-team.component';
import { TeamInfoComponent } from './components/admin/adteams/team-info/team-info.component';

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
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,    

    /*material imports*/
    AngularMaterialModule,
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidenavComponent,
  ],
})
export class LayoutModule1 {}
