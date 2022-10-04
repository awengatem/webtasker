import { Component, OnInit } from '@angular/core';
import { SocketIoService } from 'src/app/services/socket.io.service';

@Component({
  selector: 'app-project-action',
  templateUrl: './project-action.component.html',
  styleUrls: ['./project-action.component.scss'],
})
export class ProjectActionComponent implements OnInit {
  /**local variables */
  activeStatus: boolean = false;

  constructor(private webSocketService: SocketIoService) {}

  ngOnInit(): void {
    //testing
    this.webSocketService.listen('tick').subscribe((data) => {
      this.updateTimer(data);
    });

    // var _hours = document.querySelectorAll('.hours');
    // var _minutes = document.querySelectorAll('.minutes');
    // var _seconds = document.querySelectorAll('.seconds');

    // setInterval(() => {
    //   var date = new Date();
    //   var hours = date.getHours(),
    //     minutes = date.getMinutes(),
    //     seconds = date.getSeconds();

    //   this.setNumber(_hours[0], Math.floor(hours / 10), 1);
    //   this.setNumber(_hours[1], hours % 10, 1);

    //   this.setNumber(_minutes[0], Math.floor(minutes / 10), 1);
    //   this.setNumber(_minutes[1], minutes % 10, 1);

    //   this.setNumber(_seconds[0], Math.floor(seconds / 10), 1);
    //   this.setNumber(_seconds[1], seconds % 10, 1);
    // }, 1000);
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

  //test stuff
  startTimer(): void {
    this.webSocketService.emit('start', {});
  }
}
