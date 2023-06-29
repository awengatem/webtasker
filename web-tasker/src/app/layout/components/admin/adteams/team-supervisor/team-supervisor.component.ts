import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserAccountService } from 'src/app/services/api/user-account.service';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { TeamService } from 'src/app/services/api/team.service';
import { SupervisorService } from 'src/app/services/api/supervisor.service';

@Component({
  selector: 'app-team-supervisor',
  templateUrl: './team-supervisor.component.html',
  styleUrls: ['./team-supervisor.component.scss'],
})
export class TeamSupervisorComponent implements OnInit {
  /**variables */
  teamName!: string;
  supervisorCount: any;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Select',
    'Username',
    'Email',
    'Firstname',
    'Lastname',
    'Remove',
  ];
  teamId!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private supervisorService: SupervisorService,
    private snackBarService: SnackBarService,
    private teamService: TeamService
  ) {
    /**Get the teamId */
    const teamId = localStorage.getItem('capturedTeamId')!;
    this.teamId = teamId;
    //load data on table
    this.loadAllSupervisors(this.teamId);
  }

  ngOnInit(): void {
    this.getTeamName(this.teamId);
  }

  /**getting team name*/
  getTeamName(teamId: string) {
    this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
      console.log(team);
      this.teamName = team.teamName;
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

  /**Remove selected supervisor(s) */
  removeSelected() {
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
        title: `Remove ${selectedUsersArr.length} supervisors from this team?`,
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

  /**Method to confirm supervisor removal */
  confirmSupervisorRemoval(userId: string, username: string) {
    Swal.fire({
      title: `Remove "${username}" from this team's supervisors?`,
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
        this.removeSupervisor(userId);
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
    // if (userIdArr.length > 0) {
    //   this.userAccountService.deleteMultipleUsers(userIdArr).subscribe({
    //     next: (response: any) => {
    //       console.log(response);
    //       this.snackBarService.displaySnackbar('success', response.message);
    //       this.loadAllUsers();
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       Swal.fire('Oops! Something went wrong', err.error.message, 'error');
    //     },
    //   });
    // }
  }

  /**Remove a specified supervisor */
  removeSupervisor(userId: string) {
    // this.userAccountService.deleteUser(userId).subscribe({
    //   next: (response: any) => {
    //     this.snackBarService.displaySnackbar('success', response.message);
    //     this.loadAllUsers();
    //   },
    //   error: (err) => {
    //     console.log(err);
    //     Swal.fire('Oops! Something went wrong', err.error.message, 'error');
    //   },
    // });
  }

  /**Method to reload supervisor table */
  loadAllSupervisors(teamId: string) {
    //reset the selection
    this.selection = new SelectionModel<any>(true, []);
    //load data
    this.supervisorService.getTeamSupervisors(teamId).subscribe({
      next: (supervisors) => {
        this.dataSource = new MatTableDataSource(supervisors);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // refresh supervisor count
        this.supervisorCount = supervisors.length;
        console.log(supervisors);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
