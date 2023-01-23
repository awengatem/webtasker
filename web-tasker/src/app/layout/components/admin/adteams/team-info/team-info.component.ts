import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
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
  /**variable for search parameter */
  searchText = '';
  placeholder = 'enter username to search ...';

  //control the router link, defines active default tab
  tab1: boolean = true;

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
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

    //check where from and decide which tab to display
    if (this.projectService.getFromAssigning()) {
      this.showProjects();
    }
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

    /**note selected tab to help in shared + button
     * difference noted by routerlink
     * also customize placeholder value
     */
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

  //method to load projects tab
  showProjects() {
    this.showTab('projects', 'tabNav2');
    //unset
    this.projectService.setFromAssigning(false);
  }

  //getting projects for team
  getTeamProjects(teamId: string) {
    this.teamService.getTeamProjects(teamId).subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      /**get project members immediately
       * after filling projects array*/
      this.getProjectMembers();
    });
  }

  //getting members for team
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
  //used by members tab
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

  //used by projects tab
  alertConfirmation2(projectId: string, projectName: string) {
    Swal.fire({
      title: `Remove "${projectName}"?`,
      text: `Project "${projectName}' will be removed from this team and will therefore be lost by all team members.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete team from db
      if (result.value) {
        this.deleteTeamProject(projectId, projectName);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `Project "${projectName}" still belongs to this team .)`,
          'error'
        );
      }
    });
  }

  //deleting specific member
  deleteTeamMember(userId: string, username: string) {
    this.teamService.deleteTeamMember(this.teamId, userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate([`/ad_teams/${this.teamId}`]);
        Swal.fire(
          'Removed!',
          `${username} has been removed from this team.`,
          'success'
        ).then((result) => window.location.reload());
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  //deleting specific project
  deleteTeamProject(projectId: string, projectName: string) {
    //place project to be deleted in array
    let projects = [projectId];

    //pass array of projects to be deleted to api
    this.teamService.deleteTeamProject(this.teamId, projects).subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate([`/ad_teams/${this.teamId}`]);
        Swal.fire(
          'Removed!',
          `Project "${projectName}" has been removed from this team.`,
          'success'
        ).then((result) => window.location.reload());
      },
      error: (err: any) => {
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

  /**Method to navigate to previous route */
  navigateBack() {
    //check if previous location is from manage component
    let fromMng = window.sessionStorage.getItem('fromMng');
    if (fromMng === 'true') {
      //navigate to manager
      this.router.navigate(['ad_manage/teams']);
    } else {
      this.router.navigate(['/ad_teams']);
    }
  }
}
