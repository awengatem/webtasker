import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { ProjectService } from 'src/app/services/api/project.service';
import Swal from 'sweetalert2';
import { AdProjectsComponent } from '../ad-projects/ad-projects.component';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss'],
})
export class NewProjectModalComponent implements OnInit {
  form: any = {
    projectName: null,
  };
  submitted: boolean = false;

  constructor(
    public modalRef: MdbModalRef<NewProjectModalComponent>,
    private projectService: ProjectService,
    private router: Router,
    private generalService: GeneralService
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
        this.close();
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

  /**Method to navigate to previous route */
  navigateBack() {
    //check if previous location is from manage component
    let fromMng = window.sessionStorage.getItem('fromMng');
    if (fromMng === 'true') {
      //navigate to manager
      this.router.navigate(['ad_manage/projects']);
    } else {
      this.router.navigate(['/ad_projects']);
    }
  }

  submit() {
    this.submitted = true;
  }

  /**Method to close modal */
  close(): void {
    const closeMessage = 'New project modal closed';
    this.modalRef.close(closeMessage);
  }
}
