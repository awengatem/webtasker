import { Component, OnInit } from '@angular/core';
import { UserAccountService } from 'src/app/services/api/user-account.service';

@Component({
  selector: 'app-mng-users',
  templateUrl: './mng-users.component.html',
  styleUrls: ['./mng-users.component.scss'],
})
export class MngUsersComponent implements OnInit {
  displayedColumns: string[] = [
    'select',
    'FirstName',
    'LastName',
    'DateofBirth',
    'EmailId',
    'Gender',
    'Country',
    'State',
    'City',
    'Address',
    'Pincode',
    'Edit',
    'Delete',
  ];

  constructor(private userAccountService: UserAccountService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  /**Get the users */
  getUsers(): void {
    this.userAccountService.getUsers().subscribe({
      next: (users) => {
        console.log(users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
