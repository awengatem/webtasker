import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { url } from 'src/app/configs';
import { AccountService } from './account-service.service';
@Injectable({
  providedIn: 'root',
})
export class SocketIoService {
  socket: io.Socket;
  roomId: any;

  constructor(private accountService: AccountService) {
    /**Get the user from token */
    const user = this.accountService.getUser();
    /**set roomId from userId */
    if (user) {
      this.roomId = user._id;
    }

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
    this.socket.emit('create', this.roomId);

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
