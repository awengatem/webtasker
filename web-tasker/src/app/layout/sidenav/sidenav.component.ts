import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { navBarData } from './nav-data';

interface sideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<sideNavToggle> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  //variables
  collapsed = true;
  navData = navBarData;
  screenWidth = 0;

  toggleCollapse(): void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth:this.screenWidth});
  }

  closeSidenav(): void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed,screenWidth:this.screenWidth});
  }
} 
