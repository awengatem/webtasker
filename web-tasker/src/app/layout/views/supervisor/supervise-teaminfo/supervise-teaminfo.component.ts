import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ProjectFilterPipe, UserFilterPipe } from 'src/app/filter.pipe';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-supervise-teaminfo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    UserFilterPipe,
    ProjectFilterPipe,
  ],
  templateUrl: './supervise-teaminfo.component.html',
  styleUrl: './supervise-teaminfo.component.scss',
})
export class SuperviseTeaminfoComponent implements OnInit {
  selectedTeam!: any[];
  teamName!: string;
  projects!: any[];
  members!: any[];
  teamId!: string;
  projectsLength = 0;
  /**variable for search parameter */
  searchText = '';
  placeholder = 'enter username to search ...';

  /** control the router link, defines active default tab*/
  tab1: boolean = true;

  constructor(
    private teamService: TeamService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /**subscribe to the route params*/
    this.route.params.subscribe((params: Params) => {});

    const teamId = localStorage.getItem('capturedTeamId')!;
    this.teamId = teamId;
    this.getTeamName(teamId);
    this.getTeamProjects(teamId);
    this.getTeamMembers(teamId);

    /**check where from and decide which tab to display */
    if (this.projectService.getFromAssigning()) {
      this.showProjects();
    }
  }

  /** navigation of schedule */
  tabElement: any;
  openTab: any;
  butElement: any;

  tabIdArray: string[] = [];
  loopElement: any;
  loopResult: any;

  butIdArray: string[] = [];
  loopButElement: any;
  butResult: any;

  /**monitor selected tab set default also */
  selectedTab: string = 'tabNav1';

  /**getting the open tab */
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

  /**remove active link on tab */
  removeActive() {
    this.butIdArray = ['members', 'projects'];
    this.butIdArray.forEach((tab) => {
      this.loopButElement = document.getElementById(tab);
      if (this.loopButElement.classList.contains('active')) {
        this.loopButElement.classList.remove('active');
      }
    });
  }

  /**method used by navtab buttons for navigation */
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
        this.tab1 = true;
        this.placeholder = 'enter username to search ...';
      } else if (tabId === 'tabNav2') {
        this.tab1 = false;
        this.placeholder = 'enter project name to search ...';
      }
    }
    /**clear the search bar text */
    this.searchText = '';
  }

  /**method to load projects tab */
  showProjects() {
    this.showTab('projects', 'tabNav2');
    //unset
    this.projectService.setFromAssigning(false);
  }

  /**getting projects for team */
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

  /**getting members for team */
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

  /**getting team name */
  getTeamName(teamId: string) {
    this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
      console.log(team);
      this.selectedTeam = team;
      this.teamName = team.teamName;
    });
  }

  /**deleting specific member */
  deleteTeamMember(userId: string, username: string) {
    this.teamService.deleteTeamMember(this.teamId, userId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate([`/ad_teams/${this.teamId}`]);
        Swal.fire(
          'Removed!',
          `${username} has been removed from this team.`,
          'success'
        ).then((result) => this.getTeamMembers(this.teamId));
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
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
