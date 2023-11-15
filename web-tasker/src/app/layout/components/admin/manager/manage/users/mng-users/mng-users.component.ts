import { Component, OnInit, ViewChild } from '@angular/core';
import { NewUsermodalComponent } from '../new-usermodal/new-usermodal.component';
import { EditUsermodalComponent } from '../edit-usermodal/edit-usermodal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-mng-users',
  templateUrl: './mng-users.component.html',
  styleUrls: ['./mng-users.component.scss'],
  providers: [MdbModalService],
})
export class MngUsersComponent implements OnInit {
  /**define modal */
  modalRef: MdbModalRef<NewUsermodalComponent> | null = null;
  isModalOpen: boolean = false; //add background blur

  /**variables */
  totalUsers = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Select',
    'Username',
    'Email',
    'Firstname',
    'Lastname',
    'Role',
    'Edit',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userAccountService: UserAccountService,
    private snackBarService: SnackBarService,
    private modalService: MdbModalService
  ) {
    //load data on table
    this.loadAllUsers();
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
  deleteSelected() {
    // debugger;
    const selectedUsersArr = this.selection.selected;
    let userIdArr: any = [];
    console.log(selectedUsersArr);
    if (selectedUsersArr.length > 0) {
      //push only user ids in an array
      selectedUsersArr.forEach((item) => {
        userIdArr.push(item._id);
      });
      console.log(userIdArr);
      //confirm and delete users
      Swal.fire({
        title: `Delete ${selectedUsersArr.length} users from the database?`,
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete users from db
        if (result.value) {
          this.deleteMultipe(userIdArr);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.snackBarService.displaySnackbar(
            'error',
            'operation has been cancelled'
          );
          //reset the selection
          this.selection = new SelectionModel<any>(true, []);
        }
      });
    } else {
      this.snackBarService.displaySnackbar('error', 'no selected records');
    }
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
      //delete user from db
      if (result.value) {
        this.deleteUser(userId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  /**Method to deletemultiple */
  deleteMultipe(userIdArr: any[]) {
    if (userIdArr.length > 0) {
      this.userAccountService.deleteMultipleUsers(userIdArr).subscribe({
        next: (response: any) => {
          console.log(response);
          this.snackBarService.displaySnackbar('success', response.message);
          this.loadAllUsers();
        },
        error: (err) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
    }
  }

  /**Delete a specified user */
  deleteUser(userId: string) {
    this.userAccountService.deleteUser(userId).subscribe({
      next: (response: any) => {
        this.snackBarService.displaySnackbar('success', response.message);
        this.loadAllUsers();
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Method to reload user table */
  loadAllUsers() {
    //reset the selection
    this.selection = new SelectionModel<any>(true, []);
    //load data
    this.userAccountService.getUsers().subscribe({
      next: (users) => {
        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // refresh usercount
        this.totalUsers = users.length;
        console.log(users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**METHODS USED BY MODAL */
  /**open new user modal */
  openNewUserModal() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(NewUsermodalComponent, {
      modalClass: 'modal-dialog-centered modal-xl',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      // refresh data table
      this.loadAllUsers();
    });
  }
  /**open edit user modal */
  openEditUserModal(userId: string) {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(EditUsermodalComponent, {
      modalClass: 'modal-dialog-centered modal-xl',
      data: { userId: userId },
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      // refresh data table
      this.loadAllUsers();
    });
  }
}
