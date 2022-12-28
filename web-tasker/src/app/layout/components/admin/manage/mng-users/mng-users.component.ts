import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}
}
