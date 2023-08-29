import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/api/project.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { NewProjectModalComponent } from '../new-projectmodal/new-projectmodal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-ad-projects',
  templateUrl: './ad-projects.component.html',
  styleUrls: ['./ad-projects.component.scss'],
})
export class AdProjectsComponent implements OnInit {
  projects!: any[];
  projectsLength = 0;
  projDiv: any;
  projectStatus: any;
  submitted: boolean = false;
  /**used by search bar */
  searchText = '';

  /**define modal */
  modalRef: MdbModalRef<NewProjectModalComponent> | null = null;
  isModalOpen: boolean = false; //add background blur

  /**variables used in project status */
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private projectStatusService: ProjectStatusService,
    private modalService: MdbModalService
  ) {}

  ngOnInit(): void {
    this.getProjects();
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      console.log(params);
    });
    this.scrollDown();
  }

  getProjects() {
    this.projectService.getAllProjects().subscribe((projects: any) => {
      this.projects = projects;
      /**pushs project status and teams to projects*/
      this.projects.forEach((project) => (project.status = 'Unknown'));
      this.projectsLength = projects.length;
      //get project members
      this.getProjectMembers();
      //get team projects for each
      this.getProjectTeams();
      console.log(this.projects);
    });
  }

  /**scrolldown immediately after adding new project */
  scrollDown() {
    //ensuring intervals only run once
    if (this.projectService.getAddStatus() === true) {
      const setInterval_ID = window.setInterval(() => {
        this.projDiv = document.getElementById('projects');
        this.projDiv.scrollTop = this.projDiv?.scrollHeight;
      }, 100);

      //stopping interval above after sometime
      window.setTimeout(() => {
        window.clearInterval(setInterval_ID);
      }, 500);
    }
    //unsetting the condition
    this.projectService.setAddStatus(false);
    //console.log(this.projectService.getAddStatus());
  }

  /**Capture project to help load it to edit component */
  captureProject(project: string) {
    this.projectService.setCapturedProject(project);
  }

  /**ACTION METHODS USED BY ALERT*/
  alertConfirmation(projectId: string, projectName: string) {
    Swal.fire({
      title: `Delete "${projectName}"?`,
      text: `This process is irreversible. Project "${projectName}" will be lost in all teams assigned to.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.deleteProject(projectId, projectName);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `Project "${projectName}" still in our database.)`,
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

  /**Get project members and status*/
  getProjectMembers() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectMembers(this.projects[i]._id)
          .subscribe((members: any) => {
            // console.log(members.length);
            //push number of members to projects
            this.projects[i].members = members.length;
          });
      }
    }
    //get the project status here
    this.getProjectStatus();
  }

  /**Get the project status from active status docs
   * identify active projects
   */
  getProjectStatus() {
    /**reset the active projects and projects variables */
    this.uniqueProjects = [];

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

        //set status to active for each project in the unique array
        if (this.projects.length > 0) {
          for (let project of this.projects) {
            for (let id of this.uniqueProjects) {
              if (id === project._id) {
                project.status = 'Active';
              }
            }
          }
          //set others to unproductive
          for (let project of this.projects) {
            if (project.status != 'Active') {
              project.status = 'Unproductive';
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /**Get team projects for each */
  getProjectTeams() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectTeams(this.projects[i]._id)
          .subscribe((teams: any) => {
            // console.log(teams.length);
            //push number of teams to projects
            this.projects[i].teams = teams.length;
          });
      }
    }
  }

  /**save the project id to local storage*/
  saveProjectId(projectId: string) {
    localStorage.setItem('capturedProjectId', projectId);
  }

  submit() {
    this.submitted = true;
  }

  /**METHODS USED BY MODAL */
  /**open new user modal */
  openNewProjectModal() {
    this.isModalOpen = true;
    this.modalRef = this.modalService.open(NewProjectModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      /**Refresh projects */
      this.getProjects();
      this.scrollDown();
    });
  }
}
