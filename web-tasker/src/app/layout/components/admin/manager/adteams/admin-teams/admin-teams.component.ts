import { Component, OnInit } from '@angular/core';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { TeamService } from 'src/app/services/api/team.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { EditTeammodalComponent } from '../edit-teammodal/edit-teammodal.component';
import { NewTeammodalComponent } from '../new-teammodal/new-teammodal.component';

@Component({
  selector: 'app-admin-teams',
  templateUrl: './admin-teams.component.html',
  styleUrls: ['./admin-teams.component.scss'],
})
export class AdminTeamsComponent implements OnInit {
  teams!: any[];
  teamsLength = 0;
  members = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

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

  constructor(
    private teamService: TeamService,
    private projectStatusService: ProjectStatusService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.getTeams();
  }

  /**Get all teams from API */
  getTeams() {
    this.teamService.getAllTeams().subscribe((teams: any) => {
      this.teams = teams;
      /**pushs team status to teams*/
      this.teams.forEach((team) => (team.status = 'Unknown'));
      this.teamsLength = teams.length;
      //get team members for each
      this.getTeamMembers();
      //get team projects for each
      this.getTeamProjects();
      console.log(this.teams);
    });
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
  getTeamProjects() {
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

  //getting the open tab
  getOpenTab(): string {
    this.tabIdArray = ['tab1', 'tab2','tab3', 'tab4'];
    this.tabIdArray.forEach((tab) => {
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains('card-active')) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }

  //method used by navtab buttons for navigation
  showTab(cardId: string) {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('card-active');
    // this.removeActive();
    this.cardElement = document.getElementById(cardId);
    this.cardElement.classList.add('card-active');
    // this.tabElement = document.getElementById(tabId);
    // this.tabElement.classList.add('active');

    // /**note selected tab to help in shared + button
    //  * difference noted by routerlink
    //  * also customize placeholder value
    //  */
    // if (tabId) {
    //   this.selectedTab = tabId;
    //   if (tabId === 'tabNav1') {
    //     this.addButtonText = 'Add member';
    //     this.tab1 = true;
    //     this.placeholder = 'enter username to search ...';
    //   } else if (tabId === 'tabNav2') {
    //     this.addButtonText = 'Assign Project';
    //     this.tab1 = false;
    //     this.placeholder = 'enter project name to search ...';
    //   }
    // }    
  }

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
}
