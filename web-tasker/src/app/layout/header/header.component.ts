import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();
  @Output() openModal: EventEmitter<any> = new EventEmitter();

  constructor(
    private account: AccountService,
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  username!: string;

  ngOnInit(): void {
    //this.getUserAccount();
    //this.getNewAccessToken();
    this.getUsername();
  }

  /**Emit sidenav toggle */
  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  /**Emit logout */
  logger() {
    this.logout.emit();
  }

  /**Emit show Modal */
  showModal() {
    this.openModal.emit();
  }

  /**Get the username to set in label */
  private getUsername(): any {
    this.username = this.authService.getUser().username;
  }

  //establihing only authorized users can access the application
  private getUserAccount(): any {
    this.account.getUserAccount().subscribe({
      next: (data) => {
        console.log('useraccount below');
        console.log(data);
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
    //remember to create an angular guard to guard routes
  }

  //testing of check new access token
  getNewAccessToken() {
    this.tokenService.getNewToken().subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('new access token in response below');
        console.log(response.body);
        const token = response.body.accessToken;
        console.log(token);
      },
      error: (err: any) => {
        console.log(err.error.message);
      },
    });
  }

  //methods used by github and help icons in header
  goToLink(url: string) {
    window.open(url, '_blank');
  }
}
