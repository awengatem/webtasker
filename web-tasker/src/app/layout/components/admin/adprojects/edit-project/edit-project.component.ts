import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { ProjectService } from 'src/app/services/api/project.service';
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

  ngOnInit(): void {
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      // this.projectId = params['projectId'];
      // console.log(this.projectId);
    });
    this.projectId = localStorage.getItem('capturedProjectId')!;
    console.log(this.projectId);

    //get the selected project
    if (this.projectId) {
      this.loadFieldsToEdit(this.projectId);
      document.getElementById('autofocus')!.focus();
    }
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
        this.navigateBack();
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

  /**Method to navigate to previous route */
  navigateBack() {
    //check if previous location is from manage component
    let fromMng = window.sessionStorage.getItem('fromMng');
    if (fromMng === 'true') {
      //navigate to manager
      this.router.navigate(['ad_manage/projects']);
    } else {
      this.router.navigate([`/ad_projects/${this.projectId}`]);
    }
  }

  submit() {
    this.submitted = true;
  }
}
