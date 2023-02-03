import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  constructor(public modalRef: MdbModalRef<UserProfileComponent>) {}

  ngOnInit(): void {}

  /**Method to close modal */
  close(): void {
    this.modalRef.close();
  }
}
