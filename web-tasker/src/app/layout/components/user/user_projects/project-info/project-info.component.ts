import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  projectName: any;
  createdBy: any;
  lastUpdated: any;
  teamName: any;
  selectedProject!: any[];
  projectId!: string;
  actionClicked = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private teamService: TeamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      this.projectId = projectId;
      this.getTeamName();
      this.getProject(projectId);
    });
  }

  //getting project name
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project: any) => {
        console.log(project);
        this.selectedProject = project;
        project.projectName
          ? (this.projectName = project.projectName)
          : (this.projectName = 'Project name');
        project.createdBy
          ? (this.createdBy = project.createdBy)
          : (this.createdBy = 'Unknown');
        project.updatedAt
          ? (this.lastUpdated = project.updatedAt)
          : (this.lastUpdated = 'Unknown');
        project.teams ? this.teamName : (this.teamName = 'Team name');
      },
      error: (err) => {
        console.log(err);
        //redirect to projects if anything goes wrong
        this.router.navigate(['/projects']);
      },
    });
  }

  //getting the team name
  getTeamName() {
    /**get teamId first*/
    let teamId = this.projectService.getCapturedProjectTeam();
    /**check from localstorage if it is undefined*/
    if (teamId === undefined) {
      teamId = localStorage.getItem('capturedProjectTeam')!;
    }
    if (teamId != undefined) {
      this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
        this.teamName = team.teamName;
        /**store this in localstorage to aid in refresh */
        localStorage.setItem('capturedProjectTeam', teamId);
      });
    } else {
      this.teamName = 'Unknown';
    }
  }

  //clear localstorage teamId immediately we navigate away
  clearCapturedTeam() {
    localStorage.removeItem('capturedProjectTeam');
  }

  //method to show action menu
  action() {
    this.actionClicked = !this.actionClicked;
  }
}
