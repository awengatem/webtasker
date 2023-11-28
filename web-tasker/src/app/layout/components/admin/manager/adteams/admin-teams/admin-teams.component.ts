import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { TeamService } from 'src/app/services/api/team.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { EditTeammodalComponent } from '../edit-teammodal/edit-teammodal.component';
import { NewTeammodalComponent } from '../new-teammodal/new-teammodal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { SnackBarService } from 'src/app/services/snackbar.service';
import Swal from 'sweetalert2';
import { ProjectService } from 'src/app/services/api/project.service';

@Component({
  selector: 'app-admin-teams',
  templateUrl: './admin-teams.component.html',
  styleUrls: ['./admin-teams.component.scss'],
})
export class AdminTeamsComponent implements OnInit {
  teams!: any[];
  teamsLength = 0;

  /**define modal */
  modalRef: MdbModalRef<EditTeammodalComponent> | null = null;
  isModalOpen: boolean = false; //add background blur

  /**variables used in team status */
  teamidArr: string[] = [];
  uniqueTeams: string[] = [];

  /**navigation of tabs*/
  cardElement: any;
  tabIdArray: string[] = [];
  loopElement: any;
  loopResult: any;
  openTab: any;
  tabStates: any = {
    tab1: true, //default tab1 as open
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
  };

  /**table variables */
  totalUsers = 0;
  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'Select',
    'Projectname',
    'Createdby',
    'Members',
    'Remove',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  /**Temporary variable for testing datasource */
  projects = [
    {
      projectName: 'project1',
      members: 5,
      createdAt: '2023-01-09T00:49:27.372Z',
      createdBy: 'joe123',
    },
    {
      projectName: 'project2',
      members: 3,
      createdAt: '2023-01-09T00:49:27.372Z',
      createdBy: 'joe123',
    },
    {
      projectName: 'project3',
      members: 37,
      createdAt: '2023-01-09T00:49:27.372Z',
      createdBy: 'joe123',
    },
    {
      projectName: 'gravity',
      members: 15,
      createdAt: '2023-01-09T00:49:27.372Z',
      createdBy: 'joe123',
    },
  ];

  /**TEAM INFO VARIABLES */
  /**Team Info object */
  teaminfo = {
    teamId: '',
    teamName: 'team',
    status: 'Unknown',
    members: 0,
    projects: 0,
    supervisors: 0,
  };
  teamProjectsArr!: any[];

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private projectStatusService: ProjectStatusService,
    private snackBarService: SnackBarService,
    private modalService: MdbModalService
  ) {
    //load data on table
    // this.loadAllProjects();
  }

  ngOnInit(): void {
    this.getTeams().then((team) => {
      /**Load teaminfo for the first team */
      this.loadTeamInfo(team);
    });
    this.showTab('tab2');
  }

  /***  TEAM SECTION  ***/
  /**Get all teams from API */
  getTeams() {
    return new Promise((resolve, reject) => {
      this.teamService.getAllTeams().subscribe((teams: any) => {
        this.teams = teams;
        /**pushs team status to teams*/
        this.teams.forEach((team) => (team.status = 'Unknown'));
        this.teamsLength = teams.length;
        //get team members for each
        this.getTeamMembers();
        //get team projects for each
        this.getTeamProjectsNumber();
        console.log(this.teams);
        resolve(teams[0]);
      });
    });
  }

  /**Get the team status from active status docs
   * identify active teams
   */
  getTeamStatus() {
    /**reset the active teams and teams variables */
    this.uniqueTeams = [];

    this.projectStatusService
      .getActiveStatusDocs()
      .then((documents: any) => {
        /**capture the team ids */
        if (documents.length > 0) {
          for (let doc of documents) {
            this.teamidArr.push(doc.team_id);
          }
        }
        //get unique teams
        this.uniqueTeams = [...new Set(this.teamidArr)];

        //set status to active for each team in the unique array
        if (this.teams.length > 0) {
          for (let team of this.teams) {
            for (let id of this.uniqueTeams) {
              if (id === team._id) {
                team.status = 'Active';
              } else {
                team.status = 'Unproductive';
              }
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**Get team projects for each */
  getTeamProjectsNumber() {
    if (this.teams.length > 0) {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamService
          .getTeamProjects(this.teams[i]._id)
          .subscribe((projects: any) => {
            // console.log(projects.length);
            //push number of projects to teams
            this.teams[i].projects = projects.length;
          });
      }
    }
  }

  /**Get team members for each */
  getTeamMembers() {
    if (this.teams.length > 0) {
      for (let i = 0; i < this.teams.length; i++) {
        this.teamService
          .getTeamMembersDoc(this.teams[i]._id)
          .subscribe((members: any) => {
            // console.log(members.length);
            //push number of members to teams
            this.teams[i].members = members.length;
          });
      }
    }
    //get the team status here
    this.getTeamStatus();
  }

  /**Load the team info */
  loadTeamInfo(team: any) {
    const teamId = team._id;
    console.log(team);
    /**Fill the tabs data */
    this.teaminfo.teamId = team._id;
    this.teaminfo.teamName = team.teamName;
    this.teaminfo.status = team.status;
    this.teaminfo.members = team.members;
    this.teaminfo.projects = team.projects;
    // this.teaminfo.supervisors = team.supervisors;
    /**get the team projects */
    this.getTeamProjects(teamId);
  }
  /*** END OF TEAM SECTION ***/

  /***  TEAM INFO SECTION  ***/
  /**Get the team Projects */
  getTeamProjects(teamId: string) {
    this.teamService.getTeamProjects(teamId).subscribe((projects: any) => {
      // console.log(projects);
      /**push number of projects to teams*/
      this.teamProjectsArr = projects;
      console.log(this.teamProjectsArr);
      /**Get project members */
      this.getProjectMembers();
      /**Load the projects to table */
      this.loadAllProjects(projects);
    });
  }

  /**Get project members*/
  getProjectMembers() {
    if (this.teamProjectsArr.length > 0) {
      for (let i = 0; i < this.teamProjectsArr.length; i++) {
        this.projectService
          .getProjectMembers(this.teamProjectsArr[i]._id)
          .subscribe((members: any) => {
            // console.log(members.length);
            //push number of members to projects
            this.teamProjectsArr[i].members = members.length;
          });
      }
    }
  }
  /*** END OF TEAM INFO SECTION ***/

  /**METHODS FOR DATASOURCE */
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

  /**Method to reload user table */
  loadAllProjects(projects: any) {
    //reset the selection
    this.selection = new SelectionModel<any>(true, []);
    //add projects to table
    this.dataSource = new MatTableDataSource(projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log(this.projects);
  }

  /**Method to convert timestamp to date */
  convertDate(timestamp: string): string {
    const date = new Date(timestamp);
    // const newDate = date.toLocaleString();
    return date.toLocaleString();
  }

  /**Delete selected project(s) */
  deleteSelected() {
    const selectedProjectsArr = this.selection.selected;
    let projectIdArr: any = [];
    console.log(selectedProjectsArr);
    if (selectedProjectsArr.length > 0) {
      //push only project ids in an array
      selectedProjectsArr.forEach((item) => {
        projectIdArr.push(item._id);
      });
      console.log(projectIdArr);
      //confirm and delete projects
      Swal.fire({
        title: `Remove ${selectedProjectsArr.length} projects from the team?`,
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
          this.deleteMultipe(projectIdArr);
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
        this.deleteTeamProject(projectId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  /**Method to deletemultiple */
  deleteMultipe(projectIdArr: any[]) {
    // if (projectIdArr.length > 0) {
    //   this.projectService.deleteMultipleProjects(projectIdArr).subscribe({
    //     next: (response: any) => {
    //       console.log(response);
    //       this.snackBarService.displaySnackbar('success', response.message);
    //       this.loadAllProjects();
    //     },
    //     error: (err) => {
    //       console.log(err);
    //       Swal.fire('Oops! Something went wrong', err.error.message, 'error');
    //     },
    //   });
    // }
  }

  //removing specific project from team
  deleteTeamProject(projectId: string) {
    //place project to be deleted in array
    let projects = [projectId];

    //pass array of projects to be deleted to api
    this.teamService
      .deleteTeamProject(this.teaminfo.teamId, projects)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.snackBarService.displaySnackbar('success', res.message);
          this.getTeamProjects(this.teaminfo.teamId);
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
  }

  /**********END OF DATASOURCE SECTION ************* */

  /** METHODS FOR NAVIGATION OF TABS */
  /**getting the open tab*/
  getOpenTab(): string {
    this.tabIdArray = ['tab1', 'tab2', 'tab3', 'tab4', 'tab5'];
    this.tabIdArray.forEach((tab) => {
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains('card-active')) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }

  /**Swap the active tabs */
  swapTabs(tabId: string) {
    // Assuming tabId is a string like 'tab1', 'tab2', etc.
    for (const key in this.tabStates) {
      if (key === tabId) {
        this.tabStates[key] = true;
      } else {
        this.tabStates[key] = false;
      }
    }
  }

  /**method used by navtab buttons for navigation*/
  showTab(cardId: string) {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('card-active');
    this.swapTabs(cardId);
    this.cardElement = document.getElementById(cardId);
    this.cardElement.classList.add('card-active');
  }

  /***** END OF NAVIGATION SECTION **** */

  /**METHODS USED BY MODAL */
  /**open new team modal */
  openNewTeamModal() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(NewTeammodalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      /**Refresh teams */
      this.getTeams();
    });
  }

  /**open edit team modal */
  openEditTeamModal(teamId: string) {
    /**save the team id to local storage*/
    localStorage.setItem('capturedTeamId', teamId);

    this.isModalOpen = true;
    this.modalRef = this.modalService.open(EditTeammodalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      /**Refresh teams */
      this.getTeams();
    });
  }
  /**********END OF MODAL SECTION ************* */
}
