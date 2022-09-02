import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
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

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private generalService: GeneralService,    
  ) {}

  ngOnInit(): void {}

  createProject() {
    const { projectName } = this.form; //data comes from template not here
    //remove unneccessary whitespace
    const newProject = this.generalService.clean(projectName);
    this.projectService.createProject(newProject).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.projectService.setAddStatus(true);
        //console.log(this.projectService.getAddStatus());
        this.router.navigate(['/ad_projects']);
        Swal.fire(
          'Success!',
          `Project "${newProject}" created successfully`,
          'success'
        );
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  submit() {
    this.submitted = true;
  }
}
