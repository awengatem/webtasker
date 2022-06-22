import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { SidenavComponent } from './sidenav/sidenav.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { LayoutRoutingModule } from './layout-routing.module';
import {MatGridListModule} from '@angular/material/grid-list';

import { RouterModule } from '@angular/router';
import { WrapperComponent } from './components/wrapper/wrapper.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

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
    MatToolbarModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule, 
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
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
