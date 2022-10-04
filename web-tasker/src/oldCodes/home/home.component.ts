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
  projectStatus: any = "Unknown";
  activeStatus!: any;
  pauseTime!: any;

  /**Variables used by timer */
  cron!: any;
  //test timer
  hour = 0;
  minute = 0;
  second = 0;
  millisecond = 0;
  //reliable timer
  h = 0;
  m = 0;
  s = 0;
  ms = 0;

  //button status variables{dont tamper}
  paused = false;
  started = false;
  ended = false;

  constructor(
    private account: AccountService,
    private projectService: ProjectService,   
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
    let begin = new Date();
    //ensure timer runs if only started
    if (!this.started) {
      //set started to true
      //this.statusService.setStarted('true');
      this.started = true;
      this.cron = setInterval(() => {
        this.timer(begin);
      }, 10);
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

  pause() {
    clearInterval(this.cron);
    //capture time
    this.pauseTime = new Date();
    this.paused = true;
    //this.statusService.setPaused('true');
    //update status
    this.projectStatus = 'Break';
    this.activeStatus = false;
  }

  continue() {
    //ensure timer runs if only started
    if (this.paused) {
      this.cron = setInterval(() => {
        this.timer(this.pauseTime);
      }, 10);
      //update paused
      this.paused = false;
      //this.statusService.setPaused('false');
      //update status
      this.projectStatus = 'Productive';
      this.activeStatus = true;
    }
  }

  reset(projectId: string) {
    clearInterval(this.cron);
    this.ended = true;
    //this.statusService.setEnded('true');
    //restore all button status variable defaults
    this.paused = false;
    this.started = false;
    this.ended = false;
    // this.statusService.setPaused('false');
    // this.statusService.setStarted('false');
    // this.statusService.setEnded('false');
    //restore other defaults
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.millisecond = 0;
    document.getElementById('hour')!.innerText = '00';
    document.getElementById('minute')!.innerText = '00';
    document.getElementById('second')!.innerText = '00';
   // document.getElementById('millisecond')!.innerText = '00';
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

  timer(begin: any) {
    /**reliable timer */
    // let current = new Date();
    // let count = +current - +begin;
    // this.ms = count % 1000;
    // this.s = Math.floor(count / 1000) % 60;
    // this.m = Math.floor(count / 60000) % 60;
    // this.h = Math.floor(count / 3600000) % 60;

    // document.getElementById('hour')!.innerText = this.returnData(this.h);
    // document.getElementById('minute')!.innerText = this.returnData(this.m);
    // document.getElementById('second')!.innerText = this.returnData(this.s);
    // document.getElementById('millisecond')!.innerText = this.returnData(
    //   this.ms
    // );

    /**test timer */
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
    //document.getElementById('millisecond')!.innerText = this.returnData(this.millisecond);
  }

  returnData(input: any) {
    return input >= 10 ? input : `0${input}`;
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
        Swal.fire('Cancelled', `session still in progress .)`, 'error');
      }
    });
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

/**
 * (!started && !project.selected) ||
  (ended && !project.selected)
 */
