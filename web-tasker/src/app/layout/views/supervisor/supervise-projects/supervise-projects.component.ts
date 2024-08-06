import { Component, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ProjectService } from 'src/app/services/api/project.service';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { ProjectFilterPipe } from 'src/app/filter.pipe';
import { SuperviseProjectInfoModalComponent } from '../supervise-project-info-modal/supervise-project-info-modal.component';

@Component({
  selector: 'app-supervise-projects',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    ProjectFilterPipe,
    RouterModule,
  ],
  templateUrl: './supervise-projects.component.html',
  styleUrl: './supervise-projects.component.scss',
})
export class SuperviseProjectsComponent implements OnInit {
  projects!: any[];
  projectsLength = 0;
  projDiv: any;
  projectStatus: any;
  submitted: boolean = false;
  /**used by search bar */
  searchText = '';

  /**define modal */
  modalRef: MdbModalRef<SuperviseProjectInfoModalComponent> | null = null;
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

  /**Capture project to help load it to edit component */
  captureProject(project: string) {
    this.projectService.setCapturedProject(project);
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
  /**open project info modal */
  openProjectInfoModal(projectId: string) {
    /**save the project id to local storage*/
    localStorage.setItem('capturedProjectId', projectId);

    this.isModalOpen = true;
    this.modalRef = this.modalService.open(SuperviseProjectInfoModalComponent, {
      modalClass: 'modal-dialog-centered modal-lg',
    });
    //listen when closed
    this.modalRef.onClose.subscribe((message: any) => {
      console.log(message);
      this.isModalOpen = false;
      /**Refresh projects */
      this.getProjects();
    });
  }
}
