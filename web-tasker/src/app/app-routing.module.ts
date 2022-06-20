import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './layout/components/dashboard/dashboard.component';
import { HomeComponent } from './layout/components/home/home.component';
import { UsersComponent } from './layout/components/users/users.component';

// const routes: Routes = [
//   {path: '', redirectTo:'home',pathMatch:'full'},
//   {path: 'home', component:HomeComponent},
//   {path: 'dashboard', component:DashboardComponent},
//   {path:'users',component:UsersComponent}
// ];

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
