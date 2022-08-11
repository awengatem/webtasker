import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { AdProjectsComponent } from '../ad-projects/ad-projects.component';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {}

  createProject(name: any) {
    this.projectService.createProject(name).subscribe({
      next: (response: any) => {
        console.log(response);
        this.projectService.setAddStatus(true);
        const status = this.projectService.getAddStatus();
        console.log(status);
        this.router.navigate(['/ad_projects']);
        alert(`project ${name} created successfully`);
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }
}
