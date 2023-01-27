import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { WebRequestService } from './api/web-request.service';

@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: io.Socket;
  roomId: any;

  constructor(private webReqService: WebRequestService) {
    const roomId = localStorage.getItem('user-id');
    this.roomId = roomId;

    this.socket = io.connect(this.ROOT_URL, {
      withCredentials: true,
      extraHeaders: {
        'socket-header': 'abcd',
      },
      query: {
        socketId: localStorage.getItem('user-id') || '',
      },
    });

    /**emit room as userID*/
    this.socket.emit('create', roomId);

    /**To be used with custom ID */
    // this.socket.on('reconnect_attempt', () => {
    //   this.socket.io.opts.query = {
    //     socketId: localStorage.getItem('user-id') || '',
    //   };
    // });
  }

  /**get the root url*/
  readonly ROOT_URL = this.webReqService.ROOT_URL;

  /**method used to recover running timers */
  emitOuter() {
    /*rejoin new socket to room*/
    this.socket.emit('create', this.roomId);
    // this.socket.emit('recover', {});
  }

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
