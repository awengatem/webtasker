import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import Swal from 'sweetalert2';
import { EditProjectmodalComponent } from '../edit-projectmodal/edit-projectmodal.component';

@Component({
  selector: 'app-ad-project-info-modal',
  templateUrl: './ad-project-info-modal.component.html',
  styleUrls: ['./ad-project-info-modal.component.scss'],
})
export class AdProjectInfoModalComponent implements OnInit {
  projectName: any;
  createdBy: any;
  lastUpdated: any;
  projectId!: string;
  projectStatus = 'Unknown';
  projectTeams!: any;
  actionClicked = false;

  /**variables used in project status */
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  constructor(
    public infoModalRef: MdbModalRef<AdProjectInfoModalComponent>,
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

  //method to show action menu
  action(mode: string) {
    if (mode === 'in') {
      window.setTimeout(() => {
        this.actionClicked = true;
      }, 1000);
    } else if (mode === 'out') {
      window.setTimeout(() => {
        this.actionClicked = false;
      }, 1000);
    }
  }

  actionClick() {
    if (this.actionClicked === true) {
      this.actionClicked = false;
    } else {
      this.actionClicked = true;
    }
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

  /**Method to navigate to sessions */
  showSessions() {
    //close this modal
    this.closeProjectInfoModal();
    this.router.navigate([`/ad_projects/${this.projectId}/sessions`]);
  }

  /**METHODS USED BY MODAL */
  /**open edit project modal */
  openEditProjectModal() {
    /**save the project id to local storage*/
    localStorage.setItem('capturedProjectId', this.projectId);
    this.editModalRef = this.modalService.open(EditProjectmodalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //close this modal
    this.closeProjectInfoModal();
    //listen when closed
    this.editModalRef.onClose.subscribe((message: any) => {
      console.log(message);
      /**Open the project Info modal */
      this.openProjectInfoModal(this.projectId);
    });
  }

  /**open project info modal */
  openProjectInfoModal(projectId: string) {
    /**save the project id to local storage*/
    localStorage.setItem('capturedProjectId', projectId);

    this.infoModalRef = this.modalService.open(AdProjectInfoModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //listen when closed
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

  closeEditProjectModal(): void {
    const closeMessage = 'Project info modal closed';
    this.editModalRef.close(closeMessage);
  }
}
