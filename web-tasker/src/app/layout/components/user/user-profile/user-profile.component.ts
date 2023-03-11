import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AccountService } from 'src/app/services/account-service.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any;

  constructor(
    public modalRef: MdbModalRef<UserProfileComponent>,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  /**get user details */
  getUserDetails() {
    const user = this.accountService.getUser();
    console.log(user);
    this.user = user;
  }

  /**Method to close modal */
  close(): void {
    this.modalRef.close();
  }
}
