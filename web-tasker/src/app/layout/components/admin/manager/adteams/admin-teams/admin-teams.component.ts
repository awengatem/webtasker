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
import { SupervisorService } from 'src/app/services/api/supervisor.service';

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

  /**TABLE VARIABLES */
  /**project table variables */
  projectDataSource!: MatTableDataSource<any>;
  projectSelection = new SelectionModel<any>(true, []);
  displayedProjectColumns: string[] = [
    'Select',
    'Projectname',
    'Createdby',
    'Members',
    'Remove',
  ];
  teamProjectsArr!: any[];
  /**Temporary variable for testing datasource */
  // projects = [
  //   {
  //     projectName: 'project1',
  //     createdBy: 'joe123',
  //     members: 5,
  //   },
  // ];
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
  // members = [
  //   {
  //     firstName: 'Joe',
  //     lastName: 'Karanja',
  //     gender: 'male',
  //     email: 'joekaranjasenior52@gmail.com',
  //     status: 'active',
  //   },
  // ];
  /**supervisor table variables */
  supervisorDataSource!: MatTableDataSource<any>;
  supervisorSelection = new SelectionModel<any>(true, []);
  displayedSupervisorColumns: string[] = [
    'Select',
    'Fullname',
    'Gender',
    'Email',
    'Status',
    'Remove',
  ];
  teamSupervisorsArr!: any[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private projectStatusService: ProjectStatusService,
    private snackBarService: SnackBarService,
    private supervisorService: SupervisorService,
    private modalService: MdbModalService
  ) {
    //load data on table
    // this.loadAllProjects();
  }

  ngOnInit(): void {
    this.getTeams().then((team) => {
      /**Load teaminfo for the first team */
      setTimeout(() => {
        this.loadTeamInfo(team);
      }, 200);
    });
    this.showTab('tab1');
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
        this.getTeamMembersNumber();
        //get team projects for each
        this.getTeamProjectsNumber();
        console.log(this.teams);
        //return the first team
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
  getTeamMembersNumber() {
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
    /**get the team members */
    this.getTeamMembers(teamId);
    /**get the team supervisors */
    this.getTeamSupervisors(teamId);
  }
  /*** END OF TEAM SECTION ***/

  /***  TEAM INFO SECTION  ***/
  /*** PROJECTS SECTION */
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

  /**METHODS FOR PROJECT DATASOURCE */
  /**check whether all are selected */
  areAllProjectsSelected() {
    const numSelected = this.projectSelection.selected.length;
    const numRows =
      !!this.projectDataSource && this.projectDataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  projectMasterToggle() {
    this.areAllProjectsSelected()
      ? this.projectSelection.clear()
      : this.projectDataSource.data.forEach((r) =>
          this.projectSelection.select(r)
        );
  }
  /** The label for the checkbox on the passed row */
  projectCheckboxLabel(row: any): string {
    if (!row) {
      return `${this.areAllProjectsSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.projectSelection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.EmpId + 1}`;
  }

  /**method used by search filter */
  applyProjectFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.projectDataSource.filter = filterValue.trim().toLowerCase();

    if (this.projectDataSource.paginator) {
      this.projectDataSource.paginator.firstPage();
    }
  }

  /**Method to reload user table */
  loadAllProjects(projects: any) {
    //reset the selection
    this.projectSelection = new SelectionModel<any>(true, []);
    //add projects to table
    this.projectDataSource = new MatTableDataSource(projects);
    this.projectDataSource.paginator = this.paginator;
    this.projectDataSource.sort = this.sort;
    // console.log(projects);
  }

  /**Delete selected project(s) */
  deleteSelectedProjects() {
    const selectedProjectsArr = this.projectSelection.selected;
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
        title: `Remove ${selectedProjectsArr.length} projects?`,
        text: `${selectedProjectsArr.length} projects will be removed from the team?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete projects from db
        if (result.value) {
          this.deleteTeamProjects(projectIdArr);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.snackBarService.displaySnackbar(
            'error',
            'operation has been cancelled'
          );
          //reset the selection
          this.projectSelection = new SelectionModel<any>(true, []);
        }
      });
    } else {
      this.snackBarService.displaySnackbar('error', 'no selected records');
    }
  }

  /**Method to confirm project removal */
  confirmProjectDeletion(projectId: string, projectname: string) {
    Swal.fire({
      title: `Remove "${projectname}"?`,
      text: `${projectname} will be removed from team.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.deleteTeamProjects([projectId]);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  /**Method to deletemultiple */
  // deleteMultipe(projectIdArr: any[]) {
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
  // }

  //removing specific project from team
  deleteTeamProjects(projectIdArr: string[]) {
    //pass array of projects to be deleted to api
    this.teamService
      .deleteTeamProject(this.teaminfo.teamId, projectIdArr)
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

  /*** END OF PROJECTS DATASOURCE SECTION ***/
  /*** END OF PROJECTS SECTION ***/

  /*** MEMBERS SECTION */
  /**Get the team Members */
  getTeamMembers(teamId: string) {
    this.teamService.getTeamMembers(teamId).subscribe((members: any) => {
      // console.log(members);
      /**push number of memberss to teams*/
      this.teamMembersArr = members;
      console.log(this.teamMembersArr);
      /**Load the projects to table */
      this.loadAllMembers(members);
    });
  }

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

  /**Delete selected member(s) */
  deleteSelectedMembers() {
    const selectedMembersArr = this.memberSelection.selected;
    let memberIdArr: any = [];
    console.log(selectedMembersArr);
    if (selectedMembersArr.length > 0) {
      //push only member ids in an array
      selectedMembersArr.forEach((item) => {
        memberIdArr.push(item._id);
      });
      console.log(memberIdArr);
      //confirm and delete members
      Swal.fire({
        title: `Remove ${selectedMembersArr.length} members?`,
        text: `${selectedMembersArr.length} members will be removed from the team?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete members from db
        if (result.value) {
          this.deleteTeamMembers(memberIdArr);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.snackBarService.displaySnackbar(
            'error',
            'operation has been cancelled'
          );
          //reset the selection
          this.memberSelection = new SelectionModel<any>(true, []);
        }
      });
    } else {
      this.snackBarService.displaySnackbar('error', 'no selected records');
    }
  }

  /**Method to confirm member removal */
  confirmMemberDeletion(memberId: string, memberName: string) {
    Swal.fire({
      title: `Remove "${memberName}"?`,
      text: `${memberName} will be removed from team.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete team member from db
      if (result.value) {
        this.deleteTeamMembers([memberId]);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  //removing specific member from team
  deleteTeamMembers(teamIdArr: string[]) {
    //pass array of members to be deleted to api
    this.teamService
      .deleteTeamMembers(this.teaminfo.teamId, teamIdArr)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.snackBarService.displaySnackbar('success', res.message);
          this.getTeamMembers(this.teaminfo.teamId);
        },
        error: (err: any) => {
          console.log(err);
          Swal.fire('Oops! Something went wrong', err.error.message, 'error');
        },
      });
  }

  /*** END OF MEMBERS DATASOURCE SECTION ***/
  /*** END OF MEMBERS SECTION ***/

  /*** SUPERVISORS SECTION */
  /**Get the team supervisors */
  getTeamSupervisors(teamId: string) {
    this.supervisorService.getTeamSupervisors(teamId).subscribe({
      next: (supervisors) => {
        // console.log(supervisors);
        /**push number of supervisors to teams*/
        this.teamSupervisorsArr = supervisors;
        console.log(this.teamSupervisorsArr);
        /**Load the supervisors to table */
        this.loadAllSupervisors(supervisors);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  /**METHODS FOR SUPERVISORS DATASOURCE */
  /**check whether all are selected */
  areAllSupervisorsSelected() {
    // const numSelected = this.memberSelection.selected.length;
    // const numRows =
    //   !!this.memberDataSource && this.memberDataSource.data.length;
    // return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  supervisorMasterToggle() {
    // this.areAllMembersSelected()
    //   ? this.memberSelection.clear()
    //   : this.memberDataSource.data.forEach((r) =>
    //       this.memberSelection.select(r)
    //     );
  }
  /** The label for the checkbox on the passed row */
  supervisorCheckboxLabel(row: any): string {
    // if (!row) {
    //   return `${this.areAllMembersSelected() ? 'select' : 'deselect'} all`;
    // }
    // return `${
    //   this.memberSelection.isSelected(row) ? 'deselect' : 'select'
    // } row ${row.EmpId + 1}`;
    return ''; //delete this
  }

  /**method used by search filter */
  applySupervisorFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.supervisorDataSource.filter = filterValue.trim().toLowerCase();
    if (this.supervisorDataSource.paginator) {
      this.supervisorDataSource.paginator.firstPage();
    }
  }

  /**Method to reload supervisors table */
  loadAllSupervisors(supervisors: any) {
    //reset the selection
    this.supervisorSelection = new SelectionModel<any>(true, []);
    //add supervisors to table
    this.supervisorDataSource = new MatTableDataSource(supervisors);
    this.supervisorDataSource.paginator = this.paginator;
    this.supervisorDataSource.sort = this.sort;
    // console.log(supervisors);
  }

  /**Delete selected supervisor(s) */
  deleteSelectedSupervisors() {
    const selectedSupervisorsArr = this.supervisorSelection.selected;
    let supervisorDocArr: any = [];

    console.log(selectedSupervisorsArr);
    if (selectedSupervisorsArr.length > 0) {
      //push only user ids in an array
      selectedSupervisorsArr.forEach((item) => {
        const supervisorDoc = {
          user_account_id: item._id,
          team_id: this.teaminfo.teamId,
        };
        supervisorDocArr.push(supervisorDoc);
      });
      console.log(supervisorDocArr);
      //confirm and delete users
      Swal.fire({
        title: `Remove ${selectedSupervisorsArr.length} supervisors?`,
        text: `${selectedSupervisorsArr.length} members will be removed from the team?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        confirmButtonColor: '#e74c3c',
        cancelButtonText: 'No, let me think',
        cancelButtonColor: '#22b8f0',
      }).then((result) => {
        //delete users from db
        if (result.value) {
          this.deleteTeamSupervisors(supervisorDocArr);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.snackBarService.displaySnackbar(
            'error',
            'operation has been cancelled'
          );
          //reset the selection
          this.supervisorSelection = new SelectionModel<any>(true, []);
        }
      });
    } else {
      this.snackBarService.displaySnackbar('error', 'no selected records');
    }
  }

  /**Method to confirm supervisor removal */
  confirmSupervisorDeletion(supervisorId: string, supervisorName: string) {
    Swal.fire({
      title: `Remove "${supervisorName}" from this team's supervisors?`,
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
        const supervisorDoc = {
          user_account_id: supervisorId,
          team_id: this.teaminfo.teamId,
        };
        this.deleteTeamSupervisors([supervisorDoc]);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.snackBarService.displaySnackbar(
          'error',
          'operation has been cancelled'
        );
      }
    });
  }

  //removing specified supervisors from team
  deleteTeamSupervisors(supervisorDocArr: any[]) {
    if (supervisorDocArr.length > 0) {
      this.supervisorService
        .deleteMultipleSupervisors(supervisorDocArr)
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.snackBarService.displaySnackbar('success', response.message);
            this.loadAllSupervisors(this.teaminfo.teamId);
          },
          error: (err) => {
            console.log(err);
            Swal.fire('Oops! Something went wrong', err.error.message, 'error');
          },
        });
    }
  }
  /*** END OF SUPERVISORS DATASOURCE SECTION ***/
  /*** END OF SUPERVISORS SECTION ***/
  /*** END OF TEAM INFO SECTION ***/

  /*** METHODS FOR NAVIGATION OF TABS ***/
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

  /*** END OF NAVIGATION SECTION ***/

  /*** METHODS USED BY MODAL ***/
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
  /*** END OF MODAL SECTION ***/
}
