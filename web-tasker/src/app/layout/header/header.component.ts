import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AccountService } from 'src/app/services/account-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { UserProfileComponent } from '../components/user/user-profile/user-profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [MdbModalService],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  @Output() logout: EventEmitter<any> = new EventEmitter();
  /**define modal */
  modalRef: MdbModalRef<UserProfileComponent> | null = null;
  isModalOpen: boolean = false; //add background blur

  constructor(
    private account: AccountService,
    private modalService: MdbModalService,
    private tokenService: TokenService
  ) {}

  username!: string;

  ngOnInit(): void {
    //this.getUserAccount();
    //this.getNewAccessToken();
    this.getUsername();
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  logger() {
    this.logout.emit();
  }

  private getUsername(): any {
    this.username = this.account.getUser().username;
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

  /**METHODS USED BY MODAL */
  /**open user profile modal */
  openUserProfileModal() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(UserProfileComponent, {
      modalClass: 'modal-dialog-centered modal-xl',
    });
    //listen when closed
    this.modalRef.onClose.subscribe(() => {
      this.isModalOpen = false;
    });
  }
}
