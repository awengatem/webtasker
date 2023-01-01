import { Component, OnInit, ViewChild } from '@angular/core';
import { NewUsermodalComponent } from '../new-usermodal/new-usermodal.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mng-users',
  templateUrl: './mng-users.component.html',
  styleUrls: ['./mng-users.component.scss'],
  providers: [MdbModalService],
})
export class MngUsersComponent implements OnInit {
  /**define modal */
  modalRef: MdbModalRef<NewUsermodalComponent> | null = null;
  addingUser: boolean = false; //add background blur

  /**variables */
  dataSaved = false;
  employeeForm: any;
  employeeIdUpdate = null;
  totalUsers = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
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
    private _snackBar: MatSnackBar,
    private modalService: MdbModalService
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

  /**Method to confirm user deletion */
  confirmUserDeletion(userId: string, username: string) {
    Swal.fire({
      title: `Delete "${username}" from the database?`,
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete team from db
      if (result.value) {
        this.deleteUser(userId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this._snackBar.open('operation has been cancelled', 'Close', {
          duration: 2000,
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
        });
        // Swal.fire(
        //   'Cancelled',
        //   `"${username}" is still in our database.)`,
        //   'error'
        // );
      }
    });
  }

  /**Delete a specified user */
  deleteUser(userId: string) {
    this.userAccountService.deleteUser(userId).subscribe({
      next: (response: any) => {
        this.dataSaved = true;
        this.SavedSuccessful(2, response.message);
        this.loadAllUsers();
        this.employeeIdUpdate = null;
        // this.employeeForm.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Multipurpose method for edits and updates */
  SavedSuccessful(isUpdate: number, message: any) {
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
      this._snackBar.open(message, 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  /**Method to reload user table */
  loadAllUsers() {
    this.userAccountService.getUsers().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**METHODS USED BY MODAL */
  openModal() {
    this.addingUser = true;
    this.modalRef = this.modalService.open(NewUsermodalComponent, {
      modalClass: 'modal-dialog-centered modal-xl',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.addingUser = false;
    });
  }
}
