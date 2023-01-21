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
  project: any;
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
      console.log(params);
      const projectId = params['projectId'];
      const teamId = params['teamId'];
      this.projectId = projectId;
      this.teamId = teamId;
      this.getTeamName(teamId);
      this.getProject(projectId);
    });
  }

  //getting project document
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project) => {
        if (project) {
          this.project = project;
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
  getTeamName(teamId: string) {
    if (teamId) {
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
    // if (this.projectId && this.teamId) {
    this.timerService.navigator(this.projectId, this.teamId);
    // }
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

  /**method to get the project status */
  getStatus() {
    this.projectStatusService.getActiveProjects().subscribe({
      next: (documents) => {
        //console.log(documents);
        /**update status to productive or break */
        if (documents) {
          const document = documents[0];
          //console.log(document);
          /**update project status */
          if (
            this.projectId === document.project_id &&
            this.teamId === document.team_id
          ) {
            this.projectStatus = 'Active';
          } else {
            this.projectStatus = 'Unproductive';
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
