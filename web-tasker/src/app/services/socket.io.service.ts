import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { url } from 'src/app/configs';
@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: io.Socket;
  roomId: any;

  constructor() {
    const roomId = localStorage.getItem('user-id');
    this.roomId = roomId;
    /**get the root url*/
    const ROOT_URL = url.ROOT_URL;

    this.socket = io.connect(ROOT_URL, {
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

  /**method used to recover running timers */
  emitOuter() {
    /*rejoin new socket to room*/
    // this.socket.emit('create', this.roomId);
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
