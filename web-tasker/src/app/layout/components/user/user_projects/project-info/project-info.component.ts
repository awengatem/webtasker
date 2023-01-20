import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TeamService } from 'src/app/services/api/team.service';
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss'],
})
export class ProjectInfoComponent implements OnInit {
  projectName: any;
  teamId: any;
  createdBy: any;
  lastUpdated: any;
  teamName: any;
  projectId!: string;
  projectStatus = 'Unknown';
  actionClicked = false;

  /**variables used in project status */
  projectidArr: string[] = [];
  uniqueProjects: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private teamService: TeamService,
    private timerService: TimerService,
    private projectStatusService: ProjectStatusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      this.projectId = projectId;
      this.getTeamName();
      this.getProject(projectId);
    });
  }

  //getting project document
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.projectName = project.projectName;
          this.createdBy = project.createdBy;
          this.lastUpdated = project.updatedAt;
          //get project status
          this.getProjectStatus();
        } else {
          this.projectName = 'Project name';
          this.createdBy = 'Unknown';
          this.lastUpdated = 'Unknown';
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //getting the team name
  getTeamName() {
    /**get teamId first*/
    let teamId = this.projectService.getCapturedProjectTeam();
    /**check from localstorage if it is undefined*/
    if (teamId === undefined) {
      teamId = localStorage.getItem('capturedProjectTeam')!;
    }
    if (teamId != undefined) {
      /**taking the value only if type returned is an array */
      if (typeof teamId === 'object') {
        this.teamId = teamId[0];
      } else {
        this.teamId = teamId;
      }

      this.teamService.getSpecificTeam(teamId).subscribe((team: any) => {
        this.teamName = team.teamName;
      });
    } else {
      this.teamName = 'Unknown';
    }
  }

  //clear localstorage teamId immediately we navigate away
  clearCapturedTeam() {
    localStorage.removeItem('capturedProjectTeam');
    localStorage.removeItem('capturedProjectId');
  }

  /**authorize the user timer */
  authTimer() {
    this.timerService.navigator(this.projectId, this.teamId);
  }

  //method to show action menu
  action() {
    this.actionClicked = !this.actionClicked;
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
        console.log(this.projectId);
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
}
