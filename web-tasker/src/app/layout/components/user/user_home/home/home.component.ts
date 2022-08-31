import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { ProjectService } from 'src/app/services/project.service';
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
  projectStatus!: any;
  activeStatus!: any;

  /**Variables used by timer */
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;
  cron!: any;
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
      this.started = true;
      this.cron = setInterval(() => {
        this.timer();
      }, 10);
      //update status
      this.projectStatus = 'Productive';
      this.activeStatus = true;
      for (let i = 0; i < this.projects.length; i++) {
        if (this.projects[i]._id === projectId) {
          this.projects[i].selected = true;
          console.log(this.projects[i]);
        }
      }
    }else{
      //alert sesssion in progress
      Swal.fire(
        'Sorry!',
        `session in progress.`,
        'error'
      );
    }


    //save status variables to lcal storage
  }

  pause() {
    clearInterval(this.cron);
    this.paused = true;
    //update status
    this.projectStatus = 'Break';
    this.activeStatus = false;
  }

  continue() {
    //ensure timer runs if only started
    if (this.paused) {
      this.cron = setInterval(() => {
        this.timer();
      }, 10);
      //update paused
      this.paused = false;
      //update status
      this.projectStatus = 'Productive';
      this.activeStatus = true;
    }
  }

  reset(projectId: string) {
    clearInterval(this.cron);
    this.ended = true;
    //restore all button status variable defaults
    this.paused = false;
    this.started = false;
    this.ended = false;
    //restore other defaults
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.millisecond = 0;
    document.getElementById('hour')!.innerText = '00';
    document.getElementById('minute')!.innerText = '00';
    document.getElementById('second')!.innerText = '00';
    //update status
    this.projectStatus = 'Unproductive';
    this.activeStatus = null;
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i]._id === projectId) {
        this.projects[i].selected = false;
        console.log(this.projects[i]);
      }
    }
  }

  timer() {
    if ((this.millisecond += 10) == 1000) {
      this.millisecond = 0;
      this.second++;
    }
    if (this.second == 60) {
      this.second = 0;
      this.minute++;
    }
    if (this.minute == 60) {
      this.minute = 0;
      this.hour++;
    }
    document.getElementById('hour')!.innerText = this.returnData(this.hour);
    document.getElementById('minute')!.innerText = this.returnData(this.minute);
    document.getElementById('second')!.innerText = this.returnData(this.second);
  }

  returnData(input: any) {
    return input > 10 ? input : `0${input}`;
  }

  /**ACTION METHODS USED BY ALERT*/
  alertConfirmation(projectId: string) {
    Swal.fire({
      title: `End session?`,
      text: 'Session will be ended and timer reset.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      confirmButtonColor: '#e74c3c',
      cancelButtonText: 'No, let me think',
      cancelButtonColor: '#22b8f0',
    }).then((result) => {
      //delete project from db
      if (result.value) {
        this.reset(projectId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          `session still in progress .)`,
          'error'
        );
      }
    });
  }

  /**METHOD TO GET TIME AND DISPLAY GREETING */
  greetUser() {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) {
      this.greeting = `Good morning @${this.username}`;
    } else if (hours < 17) {
      this.greeting = `Good afternoon @${this.username}`;
    } else if (hours < 24) {
      this.greeting = `Good evening @${this.username}`;
    }
  }
}

/**
 * (!started && !project.selected) ||
  (ended && !project.selected)
 */
