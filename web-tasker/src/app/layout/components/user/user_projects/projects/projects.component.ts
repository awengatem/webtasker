import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
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
    private teamService: TeamService,
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

  /**getting projects belonging to user */
  getProjects() {
    this.projectService.getUserProjects().subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      /**push teamname to each project */
      for (let i = 0; i < this.projects.length; i++) {
        const teamId = this.projects[i].team;
        this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
          this.projects[i].teamName = team.teamName;
        });
      }
      /**get project members immediately
       * after filling projects array*/
      this.getProjectMembers();
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

  /**Get project members to add on icon*/
  getProjectMembers() {
    if (this.projects.length > 0) {
      for (let i = 0; i < this.projects.length; i++) {
        this.projectService
          .getProjectMembers(this.projects[i]._id)
          .subscribe((members: any) => {
            console.log(members.length);
            //push number of members to projects
            this.projects[i].members = members.length;
          });
      }
    }
  }

  /**Carry the project team to project-info through service */
  saveProjectTeam(teamId: string,projectId: string) {
    /**set the teamId to carry to the next window */
    this.projectService.setCapturedProjectTeam(teamId);
    /**store this in localstorage to aid in refresh */
    localStorage.setItem('capturedProjectTeam', teamId);
    localStorage.setItem('capturedProjectId', projectId);
    // console.log(teamId);
  }
}
