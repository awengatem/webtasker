import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
})
export class EditProjectComponent implements OnInit {
  form: any = {
    projectName: null,
  };
  submitted: boolean = false;
  projectId!: string;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  //getting capturedProject
  capturedProject!: string;

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      this.projectId = params['projectId'];
      console.log(this.projectId);
    });

    //get the selected project
    this.capturedProject = this.projectService.getCapturedProject();
    this.form.projectName = this.capturedProject;
  }

  /**edit method */
  editProject() {
    const { projectName } = this.form; //data comes from template not here
    this.projectService.editProject(this.projectId, projectName).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.projectService.setAddStatus(true);
        //console.log(this.projectService.getAddStatus());
        this.router.navigate(['/ad_projects']);
        Swal.fire('Success!', `Project "${projectName}" updated successfully`, 'success');        
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong',err.error.message, 'error');        
      },
    });
  }

  submit() {
    this.submitted = true;
  }
}
