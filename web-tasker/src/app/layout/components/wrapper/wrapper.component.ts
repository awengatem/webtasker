import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  sideNavAnimation,
  sideNavContainerAnimation,
} from './wrapper.animations';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss'],
  animations: [sideNavAnimation, sideNavContainerAnimation],
})
export class WrapperComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<any> = new EventEmitter();
  //@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  isExpanded: boolean = true;
  isOpen = true;
  sublist = false;

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {}

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isExpanded === true) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
  }

  logout1() {
    this.authService.logout();
    //console.log("logout works!!");
  }

  logout(): void {
    this.authService.logout();

    //window.location.reload();
  }

  showSublist(){
    this.sublist = !this.sublist;
    console.log("greeeeeet");
  }
}
