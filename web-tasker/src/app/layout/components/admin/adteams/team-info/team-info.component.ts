import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.scss'],
})
export class TeamInfoComponent implements OnInit {
  selectedTeam!: any[];
  teamName!: string;
  projects!: any[];

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //get the selected team
    //this.selectedTeam = this.teamService.getCapturedTeam();

    //get respective projects from route params id
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      const teamId = params['teamId'];
      this.getTeamName(teamId);
      this.getTeamProjects(teamId);
    });
  }

  //navigation of schedule
  tabElement: any;
  openTab: any;
  butElement: any;

  tabIdArray: string[] = [];
  loopElement: any;
  loopResult: any;

  butIdArray: string[] = [];
  loopButElement: any;
  butResult: any;

  //getting the open tab
  getOpenTab(): string {
    this.tabIdArray = ['tabNav1', 'tabNav2'];
    this.tabIdArray.forEach((tab) => {
      this.loopElement = document.getElementById(tab);
      if (this.loopElement.classList.contains('active')) {
        this.loopResult = tab;
      }
    });
    return this.loopResult;
  }

  //remove active link on tab
  removeActive() {
    this.butIdArray = ['members', 'projects'];
    this.butIdArray.forEach((tab) => {
      this.loopButElement = document.getElementById(tab);
      if (this.loopButElement.classList.contains('active')) {
        this.loopButElement.classList.remove('active');
      }
    });
  }

  //method used by navtab buttons for navigation
  showTab(bId: string, tabId: string) {
    this.openTab = document.getElementById(this.getOpenTab());
    this.openTab.classList.remove('active');
    this.removeActive();
    this.butElement = document.getElementById(bId);
    this.butElement.classList.add('active');
    this.tabElement = document.getElementById(tabId);
    this.tabElement.classList.add('active');
  }

  //getting projects for team
  getTeamProjects(teamId: string) {
    this.teamService.getTeamProjects(teamId).subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
    });
  }

  //getting projects for team
  getTeamName(teamId: string) {
    this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
      console.log(team);
      this.selectedTeam = team;
      this.teamName = team.teamName;
    });
  }
}
