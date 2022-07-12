import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularMaterialModule } from './angular-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LayoutModule1 } from './layout/layout.module';
import { HomeComponent } from './layout/components/home/home.component';
import { ProjectsComponent } from './layout/components/projects/projects.component';
import { UsersComponent } from './layout/components/users/users.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogHeaderComponent } from './auth/log-header/log-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProjectsComponent,
    UsersComponent,
    LoginComponent,
    RegisterComponent,
    LogHeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    //LayoutModule1,
    AppRoutingModule,
    BrowserAnimationsModule,

    //material imports
    AngularMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
