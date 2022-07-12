import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import { AngularMaterialModule } from '../angular-material.module';

import { LayoutRoutingModule } from './layout-routing.module';

import { RouterModule } from '@angular/router';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { UsersComponent } from './components/users/users.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidenavComponent,

    //components declarations
    WrapperComponent,
    HomeComponent,
    ProjectsComponent,
    UsersComponent,

    //auth declarations
    LogHeaderComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,

    //material imports
    AngularMaterialModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidenavComponent
  ]
})
export class LayoutModule1 { }
