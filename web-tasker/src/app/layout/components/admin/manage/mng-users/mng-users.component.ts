import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-mng-users',
  templateUrl: './mng-users.component.html',
  styleUrls: ['./mng-users.component.scss'],
})
export class MngUsersComponent implements OnInit {
  dataSaved = false;
  employeeForm: any;
  employeeIdUpdate = null;
  totalUsers = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = [
    'Select',
    'Username',
    'Email',
    'Firstname',
    'Lastname',
    'Edit',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userAccountService: UserAccountService,
    private _snackBar: MatSnackBar
  ) {
    this.userAccountService.getUsers().subscribe({
      next: (users) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.totalUsers = users.length;
        console.log(users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  ngOnInit(): void {
    // this.getUsers();
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

  /**check whether all are selected */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((r) => this.selection.select(r));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.EmpId + 1
    }`;
  }
  /**method used by search filter */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**Delete selected user(s) */
  deleteData() {
    // debugger;
    const numSelected = this.selection.selected;
    console.log(numSelected);
    // if (numSelected.length > 0) {
    //   if (confirm("Are you sure to delete items ")) {
    //     this.employeeService.deleteData(numSelected).subscribe(result => {
    //       this.SavedSuccessful(2);
    //       this.loadAllUsers();
    //     })
    //   }
    // } else {
    //   alert("Select at least one row");
    // }
  }

  /**Delete a specified user */
  deleteUser(employeeId: string) {
    if (confirm('Are you sure you want to delete this ?')) {
      // this.employeeService.deleteEmployeeById(employeeId).subscribe(() => {
      //   this.dataSaved = true;
      //   this.SavedSuccessful(2);
      //   this.loadAllUsers();
      //   this.employeeIdUpdate = null;
      //   this.employeeForm.reset();
      // });
    }
  }

  /**Multipurpose method for edits and updates */
  SavedSuccessful(isUpdate: number) {
    if (isUpdate == 0) {
      this._snackBar.open('Record Updated Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (isUpdate == 1) {
      this._snackBar.open('Record Saved Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (isUpdate == 2) {
      this._snackBar.open('Record Deleted Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  /**Method to reload user table */
  loadAllUsers() {
    // this.employeeService.getAllEmployee().subscribe(data => {
    //   this.dataSource = new MatTableDataSource(data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }
}
