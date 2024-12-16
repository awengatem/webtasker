import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularMaterialModule } from '../../../../angular-material.module';
import { MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import { CommonModule } from '@angular/common';
import { GeneralService } from 'src/app/services/general.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-supervise-team-page2',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularMaterialModule],
  templateUrl: './supervise-team-page2.component.html',
  styleUrl: './supervise-team-page2.component.scss',
})
export class SuperviseTeamPage2Component implements OnInit {
  selectedTeam!: any[];
  teamName!: string;
  totalEarnings: number = 500000;
  dailyEarnings: number = 35000;
  weeklyEarnings: number = 150000;
  monthlyEarnings: number = 450000;

  projects!: any[];
  teamId!: string;
  teamProjectsLength = 0;
  teamMembersLength = 0;

  /**variables used in project status */
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  /**variables for tab navigation */
  cardElement: any;
  tabIdArray: string[] = ['tab1', 'tab2', 'tab3'];
  loopElement: any;
  loopResult: any;
  openTab: any;
  activeTab: any;
  tabStates: any = {
    tab1: true, //default tab1 as open
    tab2: false,
    tab3: false,
  };

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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private teamService: TeamService,
    private projectService: ProjectService,
    private projectStatusService: ProjectStatusService,
    private generalService: GeneralService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    const teamId = localStorage.getItem('capturedTeamId')!;
    this.teamId = teamId;
    this.getTeamName(teamId);
    this.getTeamProjects(teamId);
    this.getTeamMembers(teamId);
    this.getProjectStatus();

    /**Get the active tab from local storage and display on reload */
    this.activeTab = this.generalService.getSupTeamTab();
    if (this.activeTab) {
      this.showTab(this.activeTab);
    }
  }

  /**METHODS FOR TAB NAVIGATION */
  /**getting the open tab*/
  getOpenTab(): string {
    this.tabIdArray.forEach((tab) => {
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains('card-active')) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }

  /**Change the tabs */
  swapTabs(tabId: string) {
    /**Assuming tabId is a string like 'tab1', 'tab2', etc.*/
    for (const key in this.tabStates) {
      if (key === tabId) {
        this.tabStates[key] = true;
      } else {
        this.tabStates[key] = false;
      }
    }

    /**Record in local storage */
    this.setActiveTab(tabId);
  }

  /**method used by navtab buttons for navigation*/
  showTab(cardId: string) {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('card-active');
    this.swapTabs(cardId);
    this.cardElement = document.getElementById(cardId);
    this.cardElement.classList.add('card-active');
  }

  /**Set the active tab to local storage */
  setActiveTab(tabId: string) {
    this.generalService.setSupTeamTab(tabId);
  }

  /**OTHER METHODS */
  /**get team name*/
  getTeamName(teamId: string) {
    this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
      console.log(team);
      this.selectedTeam = team;
      this.teamName = team.teamName;
    });
  }

  /**Get projects for team*/
  getTeamProjects(teamId: string) {
    this.teamService.getTeamProjects(teamId).subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      this.teamProjectsLength = projects.length;
      /**pushs project status and teams to projects*/
      this.projects.forEach((project) => (project.status = 'Unknown'));
      /**get project teams immediately
       * after filling projects array*/
      this.getProjectTeams();
    });
  }

  /**get team members */
  getTeamMembers(teamId: string) {
    this.teamService.getTeamMembers(teamId).subscribe((members: any) => {
      // let membersArr: any = [];
      // members.forEach((member: any) => {
      //   if (member) {
      //     membersArr.push(member);
      //   }
      // });
      this.teamMembersArr = members;
      console.log(this.teamMembersArr);
      this.teamMembersLength = members.length;
      /**Load the team members to table */
      this.loadAllMembers(members);
    });
  }

  /**Get team projects for each */
  getProjectTeams() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectTeams(this.projects[i]._id)
          .subscribe((teams: any) => {
            // console.log(teams.length);
            /**push number of teams to projects*/
            this.projects[i].teams = teams.length;
          });
      }
    }
  }

  /**Get the project status from active status docs
   * identify active projects
   */
  getProjectStatus() {
    /**reset the active projects and projects variables */
    this.uniqueProjects = [];

    this.projectStatusService
      .getActiveStatusDocs()
      .then((documents: any) => {
        /**capture the project ids */
        if (documents.length > 0) {
          for (let doc of documents) {
            this.projectidArr.push(doc.project_id);
          }
        }
        /**get unique projects */
        this.uniqueProjects = [...new Set(this.projectidArr)];

        /**set status to active for each project in the unique array */
        if (this.projects.length > 0) {
          for (let project of this.projects) {
            for (let id of this.uniqueProjects) {
              if (id === project._id) {
                project.status = 'Active';
              }
            }
          }
          /**set others to unproductive */
          for (let project of this.projects) {
            if (project.status != 'Active') {
              project.status = 'Unproductive';
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /*** MEMBERS SECTION */
  /**METHODS FOR MEMBERS DATASOURCE */
  /**method used by search filter */
  applyMemberFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.memberDataSource.filter = filterValue.trim().toLowerCase();
    if (this.memberDataSource.paginator) {
      this.memberDataSource.paginator.firstPage();
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  memberMasterToggle() {
    this.areAllMembersSelected()
      ? this.memberSelection.clear()
      : this.memberDataSource.data.forEach((r) =>
          this.memberSelection.select(r)
        );
  }

  /**check whether all are selected */
  areAllMembersSelected() {
    const numSelected = this.memberSelection.selected.length;
    const numRows =
      !!this.memberDataSource && this.memberDataSource.data.length;
    return numSelected === numRows;
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
      /**push only member ids in an array*/
      selectedMembersArr.forEach((item) => {
        memberIdArr.push(item._id);
      });
      console.log(memberIdArr);
      /**confirm and delete members*/
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

  /**removing specific member from team*/
  deleteTeamMembers(teamIdArr: string[]) {
    /**pass array of members to be deleted to api*/
    this.teamService.deleteTeamMembers(this.teamId, teamIdArr).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackBarService.displaySnackbar('success', res.message);
        this.getTeamMembers(this.teamId);
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
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
  /*** END OF MEMBERS DATASOURCE SECTION ***/
  /*** END OF MEMBERS SECTION ***/

  /*** PROJECTS SECTION */
  /**METHODS FOR PROJECT DATASOURCE */
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

  /**removing specific project from team*/
  deleteTeamProjects(projectIdArr: string[]) {
    //pass array of projects to be deleted to api
    this.teamService.deleteTeamProject(this.teamId, projectIdArr).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackBarService.displaySnackbar('success', res.message);
        this.getTeamProjects(this.teamId);
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }
  /*** END OF PROJECTS DATASOURCE SECTION ***/
  /*** END OF PROJECTS SECTION ***/
}
