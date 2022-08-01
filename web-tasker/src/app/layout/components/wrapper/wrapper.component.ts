import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  sideNavAnimation,
  sideNavContainerAnimation,
} from './wrapper.animations';

interface sideNavToggle {
  screenWidth: number;
  isExpanded: boolean;
}

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  animations: [sideNavAnimation, sideNavContainerAnimation],
})
export class WrapperComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<sideNavToggle> = new EventEmitter();

  //variables
  screenWidth = 0;
  isExpanded: boolean = true;
  isOpen = true;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void {
    if (this.isExpanded === true) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
    this.onToggleSideNav.emit({
      isExpanded: this.isExpanded,
      screenWidth: this.screenWidth,
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isExpanded === true) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
  }

  closeSidenav(): void {
    this.isExpanded = false;
    this.onToggleSideNav.emit({
      isExpanded: this.isExpanded,
      screenWidth: this.screenWidth,
    });
  }

  logout1() {
    this.authService.logout();
    //console.log("logout works!!");
  }

  logout(): void {
    this.authService.logout();

    //window.location.reload();
  }
}
