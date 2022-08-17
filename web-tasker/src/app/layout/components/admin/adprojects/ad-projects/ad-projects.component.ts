import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ad-projects',
  templateUrl: './ad-projects.component.html',
  styleUrls: ['./ad-projects.component.scss'],
})
export class AdProjectsComponent implements OnInit {
  projects!: any[];
  projDiv: any;
  projectStatus: any;

  /**Used by modal */
  form: any = {
    projectName: null,
  };
  submitted: boolean = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
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
      console.log(projects);
      this.projects = projects;
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
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.deleteProject(projectId, projectName);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', `Project "${projectName}" still in our database.)`, 'error');
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
        Swal.fire('Oops! Something went wrong',err.error, 'error');        
      },
    });
  }

  submit() {
    this.submitted = true;
  }
}
