import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-supervise-earning-page',
  templateUrl: './supervise-earning-page.component.html',
  styleUrls: ['./supervise-earning-page.component.scss'],
})
export class SuperviseEarningPageComponent implements OnInit {
  /**member table variables */
  memberDataSource!: MatTableDataSource<any>;
  memberSelection = new SelectionModel<any>(true, []);
  displayedMemberColumns: string[] = [
    'Select',
    'Fullname',
    'Gender',
    'Email',
    'Status',
    'Remove',
  ];
  teamMembersArr!: any[];
  /**Temporary variable for testing datasource */
  members = [
    {
      firstName: 'Joe',
      lastName: 'Karanja',
      gender: 'male',
      email: 'joekaranjasenior52@gmail.com',
      status: 'active',
    },
    {
      firstName: 'Joe',
      lastName: 'Karanja',
      gender: 'male',
      email: 'joekaranjasenior52@gmail.com',
      status: 'active',
    },
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.loadAllMembers(this.members);
  }

  ngOnInit(): void {}

  /**METHODS FOR MEMBERS DATASOURCE */
  /**check whether all are selected */
  areAllMembersSelected() {
    const numSelected = this.memberSelection.selected.length;
    const numRows =
      !!this.memberDataSource && this.memberDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  memberMasterToggle() {
    this.areAllMembersSelected()
      ? this.memberSelection.clear()
      : this.memberDataSource.data.forEach((r) =>
          this.memberSelection.select(r)
        );
  }
  /** The label for the checkbox on the passed row */
  memberCheckboxLabel(row: any): string {
    if (!row) {
      return `${this.areAllMembersSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.memberSelection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.EmpId + 1}`;
  }

  /**method used by search filter */
  applyMemberFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.memberDataSource.filter = filterValue.trim().toLowerCase();
    if (this.memberDataSource.paginator) {
      this.memberDataSource.paginator.firstPage();
    }
  }

  /**Method to reload members table */
  loadAllMembers(members: any) {
    //reset the selection
    this.memberSelection = new SelectionModel<any>(true, []);
    //add members to table
    this.memberDataSource = new MatTableDataSource(members);
    this.memberDataSource.paginator = this.paginator;
    this.memberDataSource.sort = this.sort;
    // console.log(members);
  }
}
