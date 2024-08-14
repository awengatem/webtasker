import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';

@Component({
  selector: 'app-supervise-team-page',
  templateUrl: './supervise-team-page.component.html',
  styleUrls: ['./supervise-team-page.component.scss'],
})
export class SuperviseTeamPageComponent {
  selectedTeam!: any[];
  teamName!: string;
  members: any = [];
  projects: any = [];
  teamId!: string;
  projectsLength = 0;

  cardElement: any;
  tabIdArray: string[] = [];
  loopElement: any;
  loopResult: any;
  openTab: any;
  tabStates: any = {
    tab1: true, //default tab1 as open
    tab2: false,
    tab3: false,
  };

  constructor(
    private router: Router,
    private teamService: TeamService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.members = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    this.projects = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    const teamId = localStorage.getItem('capturedTeamId')!;
    this.teamId = teamId;
    this.getTeamName(teamId);
  }

  /**METHODS FOR TAB NAVIGATION */
  /**getting the open tab*/
  getOpenTab(): string {
    this.tabIdArray = ['tab1', 'tab2', 'tab3'];
    this.tabIdArray.forEach((tab) => {
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains('card-active')) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }
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
      this.projectsLength = projects.length;
      /**get project members immediately
       * after filling projects array*/
      this.getProjectMembers();
    });
  }

  /**Get project members to add on icon*/
  getProjectMembers() {
    if (this.projects && this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectMembers(this.projects[i]._id)
          .subscribe((members: any) => {
            console.log(members.length);
            //push number of members to projects
            this.projects[i].members = members.length;
          });
      }
    }
  }
}
