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

//import used by dash component
import { LayoutModule } from '@angular/cdk/layout';
import { DashComponent } from './components/dash/dash.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidenavComponent,
    WrapperComponent,
    DashComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LayoutRoutingModule,

    //material imports
    AngularMaterialModule,

    LayoutModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    SidenavComponent
  ]
})
export class LayoutModule1 { }
