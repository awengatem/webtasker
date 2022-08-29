import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.component.html',
  styleUrls: ['./team-info.component.scss'],
})
export class TeamInfoComponent implements OnInit {
  selectedTeam!: any[];
  teamName!: string;
  projects!: any[];
  members!: any[];
  teamId!: string;

  //control the router link, defines active default tab
  tab1: boolean = true;

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
      this.teamId = teamId;
      this.getTeamName(teamId);
      this.getTeamProjects(teamId);
      this.getTeamMembers(teamId);
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
      } else if (tabId === 'tabNav2') {
        this.addButtonText = 'Assign Project';
        this.tab1 = false;
      }
    }
  }

  //getting projects for team
  getTeamProjects(teamId: string) {
    this.teamService.getTeamProjects(teamId).subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
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

  /**ACTION METHODS USED BY ALERT*/
  alertConfirmation(userId: string, username: string) {
    Swal.fire({
      title: `Remove "${username}"?`,
      text: `${username} will be removed from this team and will therefore loose all projects related to this team.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete team from db
      if (result.value) {
        this.deleteTeamMember(userId, username);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `${username} is still part of this team .)`,
          'error'
        );
      }
    });
  }

  //deleting specific member
  deleteTeamMember(userId: string, username: string) {
    this.teamService.deleteTeamMember(this.teamId, userId).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate([`/ad_teams/${this.teamId}`]);
        Swal.fire(
          'Removed!',
          `${username}" has been removed from this team.`,
          'success'
        ).then((result) => window.location.reload());
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
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
}
