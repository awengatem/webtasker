import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  projectName = 'Project name';
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
        this.projectName = project.projectName;
      });
  }
}
