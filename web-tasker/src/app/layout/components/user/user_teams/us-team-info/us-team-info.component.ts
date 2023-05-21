import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-us-team-info',
  templateUrl: './us-team-info.component.html',
  styleUrls: ['./us-team-info.component.scss'],
})
export class UsTeamInfoComponent implements OnInit {
  selectedTeam!: any[];
  teamName!: string;
  projects!: any[];
  members!: any[];
  teamId!: string;
  /**variable for search parameter */
  searchText = '';
  placeholder = 'enter username to search ...';

  //control the router link, defines active default tab
  tab1: boolean = true;

  constructor(
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    //get respective projects from route params id
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      // const teamId = params['teamId'];
      // this.teamId = teamId;
      // this.getTeamName(teamId);
      // this.getTeamProjects(teamId);
      // this.getTeamMembers(teamId);
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

  //monitor selected tab set default also
  selectedTab: string = 'tabNav1';
  addButtonText: string = 'Add member';

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

    //note selected tab to help in shared + button
    if (tabId) {
      this.selectedTab = tabId;
      if (tabId === 'tabNav1') {
        this.addButtonText = 'Add member';
        this.tab1 = true;
        this.placeholder = 'enter username to search ...';
      } else if (tabId === 'tabNav2') {
        this.addButtonText = 'Assign Project';
        this.tab1 = false;
        this.placeholder = 'enter project name to search ...';
      }
    }

    /**clear the search bar text */
    this.searchText = '';
  }

  //getting projects for team
  getTeamProjects(teamId: string) {
    this.teamService.getTeamProjects(teamId).subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      //get project members
      this.getProjectMembers();
    });
  }

  //getting members for team
  getTeamMembers(teamId: string) {
    this.teamService.getTeamMembers(teamId).subscribe((members: any) => {
      // members.forEach((member: any) => {
      //   console.log(member.username);
      // });
      this.members = members;
      //console.log(this.members);
    });
  }

  //getting team name
  getTeamName(teamId: string) {
    this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
      console.log(team);
      this.selectedTeam = team;
      this.teamName = team.teamName;
    });
  }

  //Shared function used by the + button
  addRespective() {
    if (this.selectedTab === 'tabNav1') {
      console.log('addding member');
    } else if (this.selectedTab === 'tabNav2') {
      console.log('addding project');
    }
  }

  /**Get project members */
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
