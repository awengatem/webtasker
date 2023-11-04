import { Component, OnInit } from '@angular/core';
import { SocketIoService } from 'src/app/services/socket.io.service';

@Component({
  selector: 'app-socket-test',
  templateUrl: './socket-test.component.html',
  styleUrls: ['./socket-test.component.scss'],
})
export class SocketTestComponent implements OnInit {
  title = 'Websocket Angular client ';
  userName!: string;
  message!: string;
  output: any[] = [];
  timerData: any[] = [];
  feedback!: string;

  timer!: any;

  constructor(private webSocketService: SocketIoService) {}
  ngOnInit(): void {
    this.webSocketService.listen('typing').subscribe((data) => {
      this.updateFeedback(data);
    });
    this.webSocketService.listen('chat').subscribe((data) => {
      this.updateMessage(data);
    });

    //testing
    this.webSocketService.listen('tick').subscribe((data) => {
      this.updateTimer(data);
    });
  }

  updateMessage(data: any) {
    this.feedback = '';
    if (!!!data) return;
    this.output.push(data);
  }

  updateFeedback(data: any) {
    this.feedback = `${data} is typing a message;`;
  }

  updateTimer(data: any) {
    this.timer = '';
    if (!!!data) return;
    const count = data.timer;

    let ms = count % 1000;
    let s = Math.floor(count / 1000) % 60;
    let m = Math.floor(count / 60000) % 60;
    let h = Math.floor(count / 3600000) % 60;

    document.getElementById('hour')!.innerText = this.returnData(h);
    document.getElementById('minute')!.innerText = this.returnData(m);
    document.getElementById('second')!.innerText = this.returnData(s);
    document.getElementById('millisecond')!.innerText = this.returnData(ms);
    //document.getElementById('count')!.innerText = data.timer;
    //this.timerData.push(data);
  }

  messageTyping(): void {
    console.log(`${this.userName} is typing`);
    this.webSocketService.emit('typing', this.userName);
  }

  sendMessage(): void {
    console.log({
      message: this.message,
      handle: this.userName,
    });
    this.webSocketService.emit('chat', {
      message: this.message,
      handle: this.userName,
    });
    this.message = '';
  }

  returnData(input: any) {
    return input >= 10 ? input : `0${input}`;
  }

  //test stuff
  startTimer(): void {
    this.webSocketService.emit('start', {});
  }
}
