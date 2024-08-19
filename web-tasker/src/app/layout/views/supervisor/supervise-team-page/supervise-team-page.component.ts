import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import { GeneralService } from 'src/app/services/general.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-supervise-team-page',
  templateUrl: './supervise-team-page.component.html',
  styleUrls: ['./supervise-team-page.component.scss'],
})
export class SuperviseTeamPageComponent {
  selectedTeam!: any[];
  teamName!: string;
  members: any = [];
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

  constructor(
    private router: Router,
    private teamService: TeamService,
    private projectService: ProjectService,
    private projectStatusService: ProjectStatusService,
    private generalService: GeneralService
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

  /**get projects for team*/
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
      let membersArr: any = [];
      members.forEach((member: any) => {
        if (member) {
          membersArr.push(member);
        }
      });
      this.members = membersArr;
      // console.log(this.members);
      this.teamMembersLength = members.length;
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
            //push number of teams to projects
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
        //get unique projects
        this.uniqueProjects = [...new Set(this.projectidArr)];

        //set status to active for each project in the unique array
        if (this.projects.length > 0) {
          for (let project of this.projects) {
            for (let id of this.uniqueProjects) {
              if (id === project._id) {
                project.status = 'Active';
              }
            }
          }
          //set others to unproductive
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
}
