import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';
import { AdProjectsComponent } from '../ad-projects/ad-projects.component';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectComponent implements OnInit {
  form: any = {
    projectName: null,    
  };
  submitted: boolean = false;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit(): void {}

  createProject() {
    const { projectName } = this.form; //data comes from template not here
    this.projectService.createProject(projectName).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.projectService.setAddStatus(true);
        //console.log(this.projectService.getAddStatus());
        this.router.navigate(['/ad_projects']);       
        Swal.fire('Success!', `Project "${projectName}" created successfully`, 'success');
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong',err.error, 'error');        
      },
    });
  }

  submit(){
    this.submitted = true;
  }
}
