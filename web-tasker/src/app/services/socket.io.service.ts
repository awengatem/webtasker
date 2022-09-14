import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: io.Socket;

  constructor(private webReqService: WebRequestService) {
    this.socket = io.connect(this.ROOT_URL,{
      withCredentials: true,
      extraHeaders: {
        "socket-header":"abcd"
      }
    });
  }

  //get the root url
  readonly ROOT_URL = this.webReqService.ROOT_URL;

  listen(eventname: string): Observable<any> {
    return new Observable((subscribe) => {
      this.socket.on(eventname, (data: any) => {
        subscribe.next(data);
      });
    });
  }

  emit(eventname: string, data: any) {
    this.socket.emit(eventname, data);
  }
}
