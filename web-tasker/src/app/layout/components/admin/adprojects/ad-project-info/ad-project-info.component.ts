import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-ad-project-info',
  templateUrl: './ad-project-info.component.html',
  styleUrls: ['./ad-project-info.component.scss'],
})
export class AdProjectInfoComponent implements OnInit {
  projectName: any;
  createdBy: any;
  lastUpdated: any;
  teamCount: any;
  selectedProject!: any[];
  projectId!: string;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      this.projectId = projectId;
      this.getProject(projectId);
    });
  }

  //getting team name
  getProject(projectId: string) {
    this.projectService
      .getSpecificProject(projectId)
      .subscribe((project: any) => {
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
        project.teams
          ? (this.teamCount = project.teams.length)
          : (this.teamCount = 0);
      });
  }
}
