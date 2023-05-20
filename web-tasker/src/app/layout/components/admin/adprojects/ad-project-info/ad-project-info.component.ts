import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-project-info',
  templateUrl: './ad-project-info.component.html',
  styleUrls: ['./ad-project-info.component.scss'],
})
export class AdProjectInfoComponent implements OnInit {
  projectName: any;
  createdBy: any;
  lastUpdated: any;
  teamCount: any;
  projectId!: string;
  projectStatus = 'Unknown';
  actionClicked = false;

  /**variables used in project status */
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private projectStatusService: ProjectStatusService
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
          this.teamCount = project.teams.length ? project.teams.length : 0;
          //get project status
          this.getProjectStatus();
        } else {
          this.projectName = 'Project name';
          this.createdBy = 'Unknown';
          this.lastUpdated = 'Unknown';
          this.teamCount = 0;
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

  /**Method to navigate to sessions */
  showSessions() {
    this.router.navigate([`/ad_projects/${this.projectId}/sessions`]);
  }
}
