import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
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
    private generalService: GeneralService,
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
    //remove unecessary whitespace
    const newProject = this.generalService.clean(projectName);
    this.projectService.editProject(this.projectId, newProject).subscribe({
      next: (response: any) => {
        console.log(response);
        //setting status to true to help in scrolldown method
        this.projectService.setAddStatus(true);
        //console.log(this.projectService.getAddStatus());
        this.router.navigate(['/ad_projects']);
        Swal.fire('Success!', `Project "${newProject}" updated successfully`, 'success');        
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
