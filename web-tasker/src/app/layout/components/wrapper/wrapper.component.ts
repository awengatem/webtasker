import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';

interface sideNavToggle{
  screenWidth: number;
  isExpanded: boolean;
}

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<sideNavToggle> = new EventEmitter();

  //variables
  screenWidth = 0;
  isExpanded: boolean = true;

  constructor(private authService: AuthService,private accountService: AccountService) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }

  toggleCollapse(): void{
    this.isExpanded = !this.isExpanded;
    this.onToggleSideNav.emit({isExpanded: this.isExpanded,screenWidth:this.screenWidth});
  }

  logout1(){
    this.authService.logout();
    //console.log("logout works!!");
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        //console.log(res);
      },
      error: err => {
        console.log(err);
      }
    });
    
    //window.location.reload();
  }

}
