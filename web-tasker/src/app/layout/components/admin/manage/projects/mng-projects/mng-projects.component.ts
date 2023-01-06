import { Component, OnInit, ViewChild } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { ProjectService } from 'src/app/services/api/project.service';

@Component({
  selector: 'app-mng-projects',
  templateUrl: './mng-projects.component.html',
  styleUrls: ['./mng-projects.component.scss'],
})
export class MngProjectsComponent implements OnInit {
  /**variables */
  totalProjects = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  displayedColumns: string[] = [
    'Select',
    'Projectname',
    'Teams',
    'CreatedAt',
    'CreatedBy',
    'Edit',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectService: ProjectService,
    private _snackBar: MatSnackBar
  ) {
    //load data on table
    this.loadAllProjects();
  }

  ngOnInit(): void {}

  /**Get the projects */
  getProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        console.log(projects);
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

  /**Delete selected project(s) */ //change userIdArr
  deleteSelected() {
    // debugger;
    const selectedProjectsArr = this.selection.selected;
    let userIdArr: any = [];
    console.log(selectedProjectsArr);
    if (selectedProjectsArr.length > 0) {
      //push only user ids in an array
      selectedProjectsArr.forEach((item) => {
        userIdArr.push(item._id);
      });
      console.log(userIdArr);
      //confirm and delete projects
      Swal.fire({
        title: `Delete ${selectedProjectsArr.length} users from the database?`,
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete projects from db
        if (result.value) {
          this.deleteMultipe(userIdArr);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.displaySnackbar(0, 'operation has been cancelled');
        }
      });
    } else {
      this.displaySnackbar(0, 'no selected records');
    }
  }

  /**Method to confirm project deletion */
  confirmDeletion(projectId: string, projectname: string) {
    Swal.fire({
      title: `Delete "${projectname}" from the database?`,
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.deleteProject(projectId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.displaySnackbar(0, 'operation has been cancelled');
      }
    });
  }

  /**Method to deletemultiple */
  deleteMultipe(projectIdArr: any[]) {
    // if (userIdArr.length > 0) {
    //   this.userAccountService.deleteMultipleUsers(userIdArr).subscribe({
    //     next: (response: any) => {
    //       console.log(response);
    //       this.displaySnackbar(1, response.message);
    //       this.loadAllProjects();
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       Swal.fire('Oops! Something went wrong', err.error.message, 'error');
    //     },
    //   });
    // }
    //reset the selection
    this.selection = new SelectionModel<any>(true, []);
  }

  /**Delete a specified project */
  deleteProject(projectId: string) {
    this.projectService.deleteProject(projectId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.displaySnackbar(1, response.message);
        this.loadAllProjects();
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Multipurpose method for edits and updates */
  displaySnackbar(type: number, message: any) {
    if (type == 0) {
      this._snackBar.open(message, 'Close', {
        duration: 2000,
        panelClass: ['red-snackbar'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (type == 1) {
      this._snackBar.open(message, 'Close', {
        duration: 2000,
        panelClass: ['green-snackbar'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }

  /**Method to reload user table */
  loadAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.dataSource = new MatTableDataSource(projects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // refresh usercount
        this.totalProjects = projects.length;
        console.log(projects);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Method to convert timestamp to date */
  convertDate(timestamp: string): string {
    const date = new Date(timestamp);
    // const newDate = date.toLocaleString();
    return date.toLocaleString();
  }

  /**Method to set location to help
   *  navigate back to previous route
   */
  setLocation() {
    window.sessionStorage.setItem('fromMng', 'true');
  }
}
