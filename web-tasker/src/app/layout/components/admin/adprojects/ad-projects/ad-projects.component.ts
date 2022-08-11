import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-ad-projects',
  templateUrl: './ad-projects.component.html',
  styleUrls: ['./ad-projects.component.scss']
})
export class AdProjectsComponent implements OnInit {
  projects!: any[];

  constructor(private projectService: ProjectService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(){
    this.projectService.getAllProjects().subscribe((projects: any)=>{
      console.log(projects);
      this.projects = projects;
    });
  }

}
