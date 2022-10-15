import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { SocketIoService } from 'src/app/services/socket.io.service';
@Component({
  selector: 'app-project-action',
  templateUrl: './project-action.component.html',
  styleUrls: ['./project-action.component.scss'],
})
export class ProjectActionComponent implements OnInit {
  /**local variables */
  projectName: any;
  activeStatus: boolean = false;
  projectId!: string;
  stopwatchStarted!: boolean;
  stopwatchPaused!: boolean;
  stopwatchnotStarted!: boolean;
  stopwatchnotPaused!: boolean;

  constructor(
    private webSocketService: SocketIoService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    //get the project from params
    this.route.params.subscribe((params: Params) => {
      const projectId = params['projectId'];
      this.projectId = projectId;
      this.getProject(projectId);
    });

    //request timerbuttons from server
    this.webSocketService.emit('sendButtonStatus', {});

    //requesttimervalue from server
    this.webSocketService.emit('sendTimerValue', {});

    //listening the timer buttonStatus event to decide on buttons to display
    this.webSocketService.listen('buttonStatus').subscribe((data) => {
      this.showTimerButtons(data);
    });

    //listening the timer tick event from server
    this.webSocketService.listen('tick').subscribe((data) => {
      this.updateTimer(data);
    });

    //listening the refresh event from server
    this.webSocketService.listen('recovertimer').subscribe((data) => {
      this.webSocketService.emitOuter();
    });
  }

  digitSegments = [
    [1, 2, 3, 4, 5, 6],
    [2, 3],
    [1, 2, 7, 5, 4],
    [1, 2, 7, 3, 4],
    [6, 7, 2, 3],
    [1, 6, 7, 3, 4],
    [1, 6, 5, 4, 3, 7],
    [1, 2, 3],
    [1, 2, 3, 4, 5, 6, 7],
    [1, 2, 7, 3, 6],
  ];

  setNumber(digit: any, number: any, on: any) {
    var segments = digit.querySelectorAll('.segment');
    var current = parseInt(digit.getAttribute('data-value'));

    // only switch if number has changed or wasn't set
    if (!isNaN(current) && current != number) {
      // unset previous number
      this.digitSegments[current].forEach(function (digitSegment, index) {
        setTimeout(function () {
          segments[digitSegment - 1].classList.remove('on');
        }, index * 45);
      });
    }

    if (isNaN(current) || current != number) {
      // set new number after
      setTimeout(() => {
        this.digitSegments[number].forEach(function (digitSegment, index) {
          setTimeout(function () {
            segments[digitSegment - 1].classList.add('on');
          }, index * 45);
        });
      }, 250);
      digit.setAttribute('data-value', number);
    }
  }

  updateTimer(data: any) {
    if (!!!data) return;
    const count = data.timer;

    let ms = count % 1000;
    let s = Math.floor(count / 1000) % 60;
    let m = Math.floor(count / 60000) % 60;
    let h = Math.floor(count / 3600000) % 60;

    let hours = h,
      minutes = m,
      seconds = s;

    var _hours = document.querySelectorAll('.hours');
    var _minutes = document.querySelectorAll('.minutes');
    var _seconds = document.querySelectorAll('.seconds');

    this.setNumber(_hours[0], Math.floor(hours / 10), 1);
    this.setNumber(_hours[1], hours % 10, 1);

    this.setNumber(_minutes[0], Math.floor(minutes / 10), 1);
    this.setNumber(_minutes[1], minutes % 10, 1);

    this.setNumber(_seconds[0], Math.floor(seconds / 10), 1);
    this.setNumber(_seconds[1], seconds % 10, 1);
  }

  /**Timer control methods */
  startTimer(mode: string): void {
    const teamId = localStorage.getItem('capturedProjectTeam');
    if (mode === 'start') {
      this.webSocketService.emit('start', {
        projectId: this.projectId,
        teamId: teamId,
      });
    } else if (mode === 'continue') {
      this.webSocketService.emit('continue', {});
    }
    //update button control variables
    this.stopwatchStarted = true;
    this.stopwatchnotPaused = true;
    this.stopwatchPaused = false;
    this.stopwatchnotStarted = false;
  }

  pauseTimer(): void {
    this.webSocketService.emit('pause', {});
    //update button control variables
    this.stopwatchPaused = true;
    this.stopwatchnotPaused = false;
  }

  stopTimer() {
    //AKA reset
    this.webSocketService.emit('stop', {});
    //update button control variables
    this.stopwatchnotStarted = true;
    this.stopwatchStarted = false;
    this.stopwatchPaused = false;
    this.stopwatchnotPaused = false;
  }

  showTimerButtons(data: any) {
    if (!!!data) return;
    const timerStatus = data.status;
    //show the buttons
    if (timerStatus === 'running') {
      this.stopwatchnotPaused = true;
      this.stopwatchStarted = true;      
    } else if (timerStatus === 'paused') {
      this.stopwatchPaused = true;
      this.stopwatchStarted = true;
      this.stopwatchnotPaused = false;
    } else if (timerStatus === 'stopped') {
      this.stopwatchnotStarted = true;      
    }
  }

  //getting project name
  getProject(projectId: string) {
    this.projectService.getSpecificProject(projectId).subscribe({
      next: (project: any) => {
        project.projectName
          ? (this.projectName = project.projectName)
          : (this.projectName = 'Project name');
      },
      error: (err) => {
        console.log(err);
        //redirect to projects if anything goes wrong
        this.router.navigate(['/projects']);
      },
    });
  }
}
