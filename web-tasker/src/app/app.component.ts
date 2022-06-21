import { Component,EventEmitter, Output } from '@angular/core';

interface SideNavToggle{
  screenWidth: number;
  isExpanded: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  title = 'web-tasker';

  //variables
  screenWidth = 0;
  sideBarOpen = true;
  isExpanded = true;

  toggleCollapse(): void{
    this.isExpanded = !this.isExpanded;
    this.onToggleSideNav.emit({isExpanded: this.isExpanded,screenWidth:this.screenWidth});
  }

  //method used by header
  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
}
