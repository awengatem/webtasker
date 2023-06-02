import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { TeamService } from 'src/app/services/api/team.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-mng-teams',
  templateUrl: './mng-teams.component.html',
  styleUrls: ['./mng-teams.component.scss'],
})
export class MngTeamsComponent implements OnInit {
  /**variables */
  totalTeams = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Select',
    'Teamname',
    'Projects',
    'CreatedAt',
    'CreatedBy',
    'Edit',
    'Delete',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private teamService: TeamService,
    private snackBarService: SnackBarService
  ) {
    //load data on table
    this.loadAllTeams();
  }

  ngOnInit(): void {}

  /**Get the teams */
  getTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        console.log(teams);
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

  /**Delete selected team(s) */
  deleteSelected() {
    // debugger;
    const selectedTeamsArr = this.selection.selected;
    let teamIdArr: any = [];
    console.log(selectedTeamsArr);
    if (selectedTeamsArr.length > 0) {
      //push only team ids in an array
      selectedTeamsArr.forEach((item) => {
        teamIdArr.push(item._id);
      });
      console.log(teamIdArr);
      //confirm and delete teams
      Swal.fire({
        title: `Delete ${selectedTeamsArr.length} teams from the database?`,
        text: 'This process is irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete teams from db
        if (result.value) {
          this.deleteMultipe(teamIdArr);
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

  /**Method to confirm project deletion */
  confirmDeletion(teamId: string, teamname: string) {
    Swal.fire({
      title: `Delete "${teamname}" from the database?`,
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
        this.deleteTeam(teamId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  /**Method to deletemultiple */
  deleteMultipe(teamIdArr: any[]) {
    if (teamIdArr.length > 0) {
      this.teamService.deleteMultipleTeams(teamIdArr).subscribe({
        next: (response: any) => {
          console.log(response);
          this.snackBarService.displaySnackbar('success', response.message);
          this.loadAllTeams();
        },
        error: (err) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
    }
  }

  /**Delete a specified team */
  deleteTeam(teamId: string) {
    this.teamService.deleteTeam(teamId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBarService.displaySnackbar('success', response.message);
        this.loadAllTeams();
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Method to reload team table */
  loadAllTeams() {
    //reset the selection
    this.selection = new SelectionModel<any>(true, []);
    //load data
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        this.dataSource = new MatTableDataSource(teams);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // refresh usercount
        this.totalTeams = teams.length;
        console.log(teams);
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

  /**Set the team id in local storage to aid in the team-info component */
  captureTeamId(teamId: string) {
    /**store this in localstorage to aid in next compomnent */
    localStorage.setItem('capturedTeamId', teamId);
  }
}
