import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { url } from 'src/app/configs';
import { AccountService } from './account-service.service';
@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket!: io.Socket;
  roomId: any;

  constructor(private accountService: AccountService) {
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
  }

  /**method to initialize socket connection */
  init() {
    /**Get the user from token */
    const user = this.accountService.getUser();
    /**set roomId from userId */
    if (user) {
      this.roomId = user._id;
      /**emit room as userID*/
      this.socket.emit('create', this.roomId);
    }

    /**To be used with custom ID */
    // this.socket.on('reconnect_attempt', () => {
    //   this.socket.io.opts.query = {
    //     socketId: localStorage.getItem('user-id') || '',
    //   };
    // });
  }

  /**method to close socket*/
  closeSocket() {
    this.socket.emit('end', {});
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
