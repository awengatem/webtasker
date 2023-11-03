import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-mng-sessions',
  templateUrl: './mng-sessions.component.html',
  styleUrls: ['./mng-sessions.component.scss'],
})
export class MngSessionsComponent implements OnInit {
  /**variables */
  totalSessions = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Select',
    'Username',
    'ProjectName',
    'TeamName',
    'Status',
    'NewDuration',
    'StartTime',
    'FinishTime',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private projectStatusService: ProjectStatusService,
    private snackBarService: SnackBarService
  ) {
    //load data on table
    this.loadAllSessions();
  }

  ngOnInit(): void {}

  /**Get the sessions */
  getProjects(): void {
    this.projectStatusService.getStatusDocs().then((sessions) => {
      console.log(sessions);
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

  /**Delete selected session(s) */
  deleteSelected() {
    // debugger;
    const selectedSessionsArr = this.selection.selected;
    let sessionIdArr: any = [];
    console.log(selectedSessionsArr);
    if (selectedSessionsArr.length > 0) {
      //push only session ids in an array
      selectedSessionsArr.forEach((item) => {
        sessionIdArr.push(item._id);
      });
      console.log(sessionIdArr);
      //confirm and delete sessions
      Swal.fire({
        title: `Delete ${selectedSessionsArr.length} sessions from the database?`,
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete sessions from db
        if (result.value) {
          this.deleteMultipe(sessionIdArr);
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

  /**Method to confirm session deletion */
  confirmDeletion(sessionId: string) {
    Swal.fire({
      title: `Delete session from the database?`,
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete session from db
      if (result.value) {
        this.deleteSession(sessionId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  /**Method to deletemultiple */
  deleteMultipe(sessionIdArr: any[]) {
    if (sessionIdArr.length > 0) {
      this.projectStatusService
        .deleteMultipleProjectStatus(sessionIdArr)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.snackBarService.displaySnackbar('success', response.message);
            this.loadAllSessions();
          },
          error: (err) => {
            console.log(err);
            Swal.fire('Oops! Something went wrong', err.error.message, 'error');
          },
        });
    }
  }

  /**Delete a specified session */
  deleteSession(sessionId: string) {
    this.projectStatusService.deleteProjectStatus(sessionId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBarService.displaySnackbar('success', response.message);
        this.loadAllSessions();
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Method to reload user table */
  loadAllSessions() {
    //reset selection list
    this.selection = new SelectionModel<any>(true, []);
    //load data
    this.projectStatusService
      .getStatusDocs()
      .then((sessions: any) => {
        this.dataSource = new MatTableDataSource(sessions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // refresh usercount
        this.totalSessions = sessions.length;
        console.log(sessions);
      })
      .catch((err) => {
        console.log(err);
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
