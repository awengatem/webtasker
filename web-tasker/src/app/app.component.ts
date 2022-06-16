import { Component } from '@angular/core';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'web-tasker';

  sideBarOpen = true;
  collapsed = true;

  // toggleCollapse(): void{
  //   this.collapsed = !this.collapsed;
  //   //this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth:this.screenWidth});
  // }

  //method used by header
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }

  //variables used by below method
  isSideNavCollapsed = false;
  screenWidth = 0;  

  //shared with sidenav component
  onToggleSideNav(data: SideNavToggle){
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
