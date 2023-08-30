import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/api/project.service';
import { GeneralService } from 'src/app/services/general.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-projectmodal',
  templateUrl: './edit-projectmodal.component.html',
  styleUrls: ['./edit-projectmodal.component.scss'],
})
export class EditProjectmodalComponent implements OnInit {
  form: any = {
    projectName: null,
  };
  submitted: boolean = false;
  projectId!: string;

  constructor(
    private projectService: ProjectService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
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
        // this.navigateBack();
        Swal.fire(
          'Success!',
          `Project "${newProject}" updated successfully`,
          'success'
        );
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error.message, 'error');
      },
    });
  }

  /**Method to load the form with values to be patched */
  loadFieldsToEdit(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe((project) => {
      console.log(project);
      this.form.projectName = project.projectName;
    });
  }

  submit() {
    this.submitted = true;
  }
}
