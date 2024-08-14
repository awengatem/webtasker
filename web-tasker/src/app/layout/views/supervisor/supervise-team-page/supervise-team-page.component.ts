import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private teamService: TeamService) {}

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
}
