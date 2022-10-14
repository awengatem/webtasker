import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { StatusService } from 'src/app/services/status.service';
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
  projectStatus: any = 'Unknown';
  activeStatus!: any;
  pauseTime!: any;

  //button status variables{dont tamper}
  paused = false;
  started = false;
  ended = false;

  constructor(
    private account: AccountService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.getUsername();
    this.getProjects();
    this.greetUser();

    if (!this.started) {
      this.projectStatus = 'Unproductive';
    }
  }

  private getUsername(): any {
    this.username = this.account.getUser().username;
  }

  getProjects() {
    this.projectService.getUserProjects().subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      this.totalProjects = projects.length;
      //pushs selected status to projects
      this.projects.forEach((p) => (p.selected = false));
    });
  }

  /**METHODS USED BY TIMER */
  start(projectId: string) {
    //ensure timer runs if only started
    if (!this.started) {
      //set started to true
      //this.statusService.setStarted('true');
      this.started = true;
      //update status
      this.projectStatus = 'Productive';
      this.activeStatus = true;
      //identify the selected project
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i]._id === projectId) {
          this.projects[i].selected = true;
          console.log(this.projects[i]);
        }
      }
    } else {
      //alert sesssion in progress
      Swal.fire('Sorry!', `session in progress.`, 'error');
    }
  }

 /**Carry the project team to project-info through service */
 saveProjectTeam(teamId: string) {
  /**set the teamId to carry to the next window */
  this.projectService.setCapturedProjectTeam(teamId);
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

  hangTheBrowser() {
    let val = '';

    for (let i = 0; i < 10000; i++) {
      for (let j = 0; j < 10000; j++) {
        val = 'Loop returned: ' + i + j;
      }
    }
  }
}
