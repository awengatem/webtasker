import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account-service.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**local variables*/
  username!: string;
  projects!: any[];
  totalProjects: number = 0;
  projectStatus!: any;

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
    this.projectStatus = "Unproductive";
  }

  private getUsername(): any {
    this.username = this.account.getUser().username;
  }

  getProjects() {
    this.projectService.getUserProjects().subscribe((projects: any) => {
      console.log(projects);
      this.projects = projects;
      this.totalProjects = projects.length;
    });
  }

  /**METHODS USED BY TIMER */
  start() {
    //ensure timer runs if only started
    if (!this.started) {
      //set started to true
      this.started = true;
      this.cron = setInterval(() => {
        this.timer();
      }, 10);
      //update status
      this.projectStatus = "Productive"
    }

    //save status variables to lcal storage
  }

  pause() {
    clearInterval(this.cron);
    this.paused = true;
    //update status
    this.projectStatus = "Break"
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
      this.projectStatus = "Productive"
    }
  }

  reset() {
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
    this.projectStatus = "Unproductive"   
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
}
