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
    document.getElementById('count')!.innerText = data.timer;
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

  //test stuff
  startTimer(): void {
    this.webSocketService.emit('start',{});
  }
}
