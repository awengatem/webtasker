import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-project-teams',
  templateUrl: './project-teams.component.html',
  styleUrls: ['./project-teams.component.scss'],
})
export class ProjectTeamsComponent implements OnInit {
  projectId!: string;
  projectName: any;
  projectTeams: any;
  teams!: any[];
  /**used by search bar */
  searchText = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private teamService: TeamService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      // console.log(params);
      // const projectId = params['projectId'];
      // this.projectId = projectId;
      // if (projectId) {
      //   this.getProject(projectId);
      //   this.getProjectTeams(projectId).then(() => {
      //     //get team members for each team
      //     this.getTeamMembers();
      //   });
      // }
    });
    const projectId = localStorage.getItem('capturedProjectId')!;
    this.projectId = projectId;
    if (projectId) {
      this.getProject(projectId);
      this.getProjectTeams(projectId).then(() => {
        //get team members for each team
        this.getTeamMembers();
        //get team projects for each team
        this.getTeamProjects();
      });
    }
  }

  /**Get project name */
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.projectName = project.projectName
            ? project.projectName
            : 'Project name';
        } else {
          this.projectName = 'Project name';
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**get teams */
  getProjectTeams(projectId: string) {
    return new Promise((resolve, reject) => {
      this.projectService.getProjectTeams(projectId).subscribe({
        next: (teams) => {
          console.log(teams);
          if (teams) {
            this.teams = teams;
            this.projectTeams = teams.length;
          }
          resolve(true);
        },
        error: (err) => {
          console.log(err);
        },
      });
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

  /**Navigate back to previous route */
  goBack() {
    const previousUrl = localStorage.getItem('currentUrl');
    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
