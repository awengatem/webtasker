import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { ProjectStatusService } from 'src/app/services/api/project-status.service';
import { ProjectService } from 'src/app/services/api/project.service';
import { TimerService } from 'src/app/services/timer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**local variables*/
  username!: string;
  greeting!: string;
  projects!: any[];
  totalProjects: number = 0;
  totalSessions: number = 0;
  projectStatus: any = 'Unknown';
  idle = true; //controls statusText styling(must be true by default)
  started!: any; //controls statusText styling

  constructor(
    private accountService: AccountService,
    private projectService: ProjectService,
    private timerService: TimerService,
    private projectStatusService: ProjectStatusService
  ) {}

  ngOnInit(): void {
    this.getUsername();
    this.getProjects();
    this.greetUser();
    this.getUserSessions();
  }

  private getUsername(): any {
    this.username = this.accountService.getUser().username;
  }

  getProjects() {
    this.projectService.getUserProjects().subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      this.totalProjects = projects.length;
      //pushs project status to projects
      this.projects.forEach((p) => (p.status = 'Unknown'));

      window.setTimeout(() => {
        this.getStatus();
      }, 100);
    });
  }

  /**test*/
  start(projectId: string) {
    //identify the selected project
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i]._id === projectId) {
        this.projects[i].selected = true;
        console.log(this.projects[i]);
      }
    }
  }

  /**Set the project and team id in local storage to aid in timer guard */
  saveProjectTeam(projectId: string, teamId: string) {
    /**store this in localstorage to aid in refresh */
    localStorage.setItem('capturedProjectTeamId', teamId);
    localStorage.setItem('capturedProjectId', projectId);
    // console.log(teamId);
  }

  /**METHOD TO GET TIME AND DISPLAY GREETING */
  greetUser() {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 3) {
      this.greeting = `Good evening ${this.username}`;
    } else if (hours < 12) {
      this.greeting = `Good morning ${this.username}`;
    } else if (hours < 17) {
      this.greeting = `Good afternoon ${this.username}`;
    } else if (hours < 24) {
      this.greeting = `Good evening ${this.username}`;
    }
  }

  /**method to load the number of total user sessions */
  getUserSessions() {
    /**get userId */
    const user = this.accountService.getUser();
    const userId = user._id;
    this.projectStatusService
      .getSpecUserStatusDocs(userId)
      .then((sessions: any) => {
        this.totalSessions = sessions.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**method to get the project status */
  getStatus() {
    this.projectStatusService.getActiveProjects().subscribe({
      next: (documents) => {
        //console.log(documents);
        /**update status to productive or break */
        if (documents.length > 0) {
          /**update control variables first */
          this.idle = false;
          const document = documents[0];
          //console.log(document);
          /**update projectStatus text */
          if (document.status === 'running') {
            this.projectStatus = 'Productive';
            this.started = true;
          } else if (document.status === 'paused') {
            this.projectStatus = 'Break';
            this.started = false;
          }

          /**update project status */
          if (this.projects) {
            for (let i = 0; i < this.projects.length; i++) {
              if (
                this.projects[i]._id === document.project_id &&
                this.projects[i].team_id === document.team_id
              ) {
                this.projects[i].status = 'Active';
              } else {
                this.projects[i].status = 'Unproductive';
              }
            }
          }
        } else {
          /**update project status */
          if (this.projects) {
            for (let i = 0; i < this.projects.length; i++) {
              this.projects[i].status = 'Unproductive';
            }
            /**restore defaults as there is no active project */
            this.idle = true;
            this.started = null;
            this.projectStatus = 'Unproductive';
          }
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**authorize the user timer */
  authTimer(projectId: any, teamId: any) {
    /**store this in localstorage to aid in timer guard authorization*/
    localStorage.setItem('capturedProjectTeamId', teamId);
    localStorage.setItem('capturedProjectId', projectId);
    this.timerService.navigator(projectId, teamId);
  }
}
