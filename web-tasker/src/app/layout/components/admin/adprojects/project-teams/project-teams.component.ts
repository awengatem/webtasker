import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/services/api/project.service';

@Component({
  selector: 'app-project-teams',
  templateUrl: './project-teams.component.html',
  styleUrls: ['./project-teams.component.scss'],
})
export class ProjectTeamsComponent implements OnInit {
  projectId!: string;
  projectName: any;
  teamCount: any;
  teams!: any[];
  /**used by search bar */
  searchText = '';

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      const projectId = params['projectId'];
      this.projectId = projectId;
      if (projectId) {
        this.getProject(projectId);
        this.getProjectTeams(projectId);
      }
    });
  }

  /**Get project name */
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.projectName = project.projectName
            ? project.projectName
            : 'Project name';
          this.teamCount = project.teams.length ? project.teams.length : 0;
        } else {
          this.projectName = 'Project name';
          this.teamCount = 0;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**get teams */
  getProjectTeams(projectId: string) {
    this.projectService.getProjectTeams(projectId).subscribe({
      next: (teams) => {
        console.log(teams);
        if (teams) {
          this.teams = teams;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
