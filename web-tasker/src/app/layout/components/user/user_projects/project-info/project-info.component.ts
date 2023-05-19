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
          this.projectName = project.projectName
            ? project.projectName
            : 'Project name';
          this.createdBy = project.createdBy ? project.createdBy : 'Unknown';
          this.lastUpdated = project.updatedAt ? project.updatedAt : 'Unknown';
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
    this.timerService.navigator(this.projectId, this.teamId);
  }

  //method to show action menu
  action() {
    this.actionClicked = !this.actionClicked;
  }

  /**method to get the project status
   * Identify if project is active
   */
  getProjectStatus() {
    this.projectStatusService.getActiveProjects().subscribe({
      next: (documents) => {
        //console.log(documents);
        /**update status to productive or break */
        if (documents.length > 0) {
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
        } else {
          this.projectStatus = 'Unproductive';
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**Method to set project id to local storage */
  setProjectId(projectId: string) {
    //set to local storage
    localStorage.setItem('project-id', projectId);
    this.router.navigate(['/projects/sessions']);
  }
}
