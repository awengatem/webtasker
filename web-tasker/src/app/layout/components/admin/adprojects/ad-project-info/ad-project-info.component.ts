import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  selectedProject!: any[];
  projectId!: string;
  actionClicked = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      this.projectId = projectId;
      this.getProject(projectId);
    });
  }

  //getting team name
  getProject(projectId: string) {
    this.projectService
      .getSpecificProject(projectId)
      .subscribe((project: any) => {
        console.log(project);
        this.selectedProject = project;
        project.projectName
          ? (this.projectName = project.projectName)
          : (this.projectName = 'Project name');
        project.createdBy
          ? (this.createdBy = project.createdBy)
          : (this.createdBy = 'Unknown');
        project.updatedAt
          ? (this.lastUpdated = project.updatedAt)
          : (this.lastUpdated = 'Unknown');
        project.teams
          ? (this.teamCount = project.teams.length)
          : (this.teamCount = 0);
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
    if(this.actionClicked === true){
    this.actionClicked = false;
    }else{
      this.actionClicked = true;
    }
  }

  /**Capture project to help load it to edit component */
  captureProject() {
    this.projectService.setCapturedProject(this.projectName);
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
}
