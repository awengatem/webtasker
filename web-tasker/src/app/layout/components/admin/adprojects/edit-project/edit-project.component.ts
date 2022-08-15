import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

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

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  /**edit method */
  editProject() {
    const { projectName } = this.form; //data comes from template not here
    //subscribe to the route params
    this.route.params.subscribe((params: Params) => {
      const projId = params['projectId'];
      console.log(projId);
      // this.projectService.editProject(projectName, projId).subscribe({
      //   next: (response: any) => {
      //     console.log(response);
      //     //setting status to true to help in scrolldown method
      //     this.projectService.setAddStatus(true);
      //     //console.log(this.projectService.getAddStatus());
      //     this.router.navigate(['/ad_projects']);
      //     alert(`project ${projectName} updated successfully`);
      //   },
      //   error: (err) => {
      //     alert(err.error.message);
      //   },
      // });
    });
  }

  submit() {
    this.submitted = true;
  }
}
