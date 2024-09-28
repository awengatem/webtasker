import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { EditProjectmodalComponent } from '../../admin/adprojects/edit-projectmodal/edit-projectmodal.component';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ProjectService } from 'src/app/services/api/project.service';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supervise-project-info-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './supervise-project-info-modal.component.html',
  styleUrl: './supervise-project-info-modal.component.scss',
})
export class SuperviseProjectInfoModalComponent implements OnInit {
  projectName: any;
  createdBy: any;
  lastUpdated: any;
  projectId!: string;
  projectStatus = 'Unknown';
  projectTeams!: any;

  /**variables used in project status */
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  constructor(
    public infoModalRef: MdbModalRef<SuperviseProjectInfoModalComponent>,
    public editModalRef: MdbModalRef<EditProjectmodalComponent>,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private projectStatusService: ProjectStatusService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      // const projectId = params['projectId'];
      // this.projectId = projectId;
      // this.getProject(projectId);
    });
    const projectId = localStorage.getItem('capturedProjectId')!;
    this.projectId = projectId;
    this.getProject(projectId);
  }

  //getting project document
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.projectName = project.projectName
            ? project.projectName
            : 'Project name';
          this.createdBy = project.createdBy ? project.createdBy : 'Unknown';
          this.lastUpdated = project.updatedAt ? project.updatedAt : 'Unknown';
          //get project status and project teams
          this.getProjectStatus();
          this.getProjectTeams();
        } else {
          this.projectName = 'Project name';
          this.createdBy = 'Unknown';
          this.lastUpdated = 'Unknown';
          this.projectTeams = 0;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**ACTION METHODS USED BY ALERT*/
  alertConfirmation() {
    Swal.fire({
      title: `Delete "${this.projectName}"?`,
      text: `This process is irreversible. Project "${this.projectName}" will be lost in all teams assigned to.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.deleteProject(this.projectId, this.projectName);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `Project "${this.projectName}" still in our database.)`,
          'error'
        );
      }
    });
  }

  /**Delete method */
  deleteProject(projectId: string, projectName: string) {
    this.projectService.deleteProject(projectId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.router.navigate(['/ad_projects']);
        Swal.fire(
          'Removed!',
          `Project "${projectName}" has been removed`,
          'success'
        );
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Oops! Something went wrong', err.error, 'error');
      },
    });
  }

  /**Get the project status from active status docs
   * identify if project is active
   */
  getProjectStatus() {
    /**reset the projects array */
    this.uniqueProjects = [];
    this.projectidArr = [];

    this.projectStatusService
      .getActiveStatusDocs()
      .then((documents: any) => {
        /**capture the project ids */
        if (documents.length > 0) {
          for (let doc of documents) {
            this.projectidArr.push(doc.project_id);
          }
        }
        //get unique projects
        this.uniqueProjects = [...new Set(this.projectidArr)];

        //set status to active if project is in the unique array
        for (let id of this.uniqueProjects) {
          if (id === this.projectId) {
            this.projectStatus = 'Active';
          }
        }
        if (this.projectStatus != 'Active') {
          this.projectStatus = 'Unproductive';
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**Get team projects for project */
  getProjectTeams() {
    this.projectService
      .getProjectTeams(this.projectId)
      .subscribe((teams: any) => {
        // console.log(teams.length);
        //push number of teams to projects
        this.projectTeams = teams.length;
      });
  }

  /**METHODS USED BY MODAL */
  /**open project info modal */
  openProjectInfoModal(projectId: string) {
    /**save the project id to local storage*/
    localStorage.setItem('capturedProjectId', projectId);

    this.infoModalRef = this.modalService.open(
      SuperviseProjectInfoModalComponent,
      {
        modalClass: 'modal-dialog-centered modal-lg',
      }
    );
    /**Listen when closed */
    this.infoModalRef.onClose.subscribe((message: any) => {
      console.log(message);
      /**Refresh projects */
      // this.getProjects();
    });
  }

  /**Method to close modal */
  closeProjectInfoModal(): void {
    const closeMessage = 'Project info modal closed';
    this.infoModalRef.close(closeMessage);
  }
}
