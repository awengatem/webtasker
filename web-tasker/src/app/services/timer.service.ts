import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebRequestService } from './api/web-request.service';
import { SnackBarService } from './snackbar.service';
import { SocketIoService } from './socket.io.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  constructor(
    private webReqService: WebRequestService,
    private webSocketService: SocketIoService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  /**method to authorize the user timers */
  authorizeTimer(projectId: string, teamId: string) {
    //send a request to check if timer is allowed
    return this.webReqService.post('timer_check', {
      projectId: projectId,
      teamId: teamId,
    });
  }

  /**method to navigate allowed users */
  navigator(projectId: string, teamId: string) {
    /**check response first */
    this.authorizeTimer(projectId, teamId).subscribe({
      next: (response: any) => {
        const message = response.message;
        console.log(message);
        /**navigate user if allowed */
        if (message === 'allowed') {
          return this.router.navigate([
            `/projects/${projectId}/${teamId}/action`,
          ]);
        }

        if (message === 'denied') {
          /**notify user */
          return Swal.fire(
            'Complete current session first!',
            `a session is already in progress.`,
            'error'
          );
        }

        return Swal.fire(
          'An error occurred!',
          `contact the administrator`,
          'error'
        );
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Error!', `${err.message}.`, 'error');
      },
    });
  }

  /**method used by timer guard to authorize user
   * method uses local storage variables
   */
  authorizeUser() {
    //let myBool = false;
    /**get the project and team ids first to check if they are authorized */
    const projectId = localStorage.getItem('capturedProjectId')!;
    const teamId = localStorage.getItem('capturedProjectTeam')!;
    /**check response first */
    return new Promise(async (resolve, reject) => {
      /**return server response to decide */
      this.authorizeTimer(projectId, teamId).subscribe({
        next: (response: any) => {
          const message = response.message;
          resolve(message);
        },
      });
    });
  }

  /**Method to test timer start */
  startTimer(data: any) {
    return this.webReqService.post('timer/start', { data });
  }

  /**Method to disconnect timer session */
  disconnectTimer() {
    this.webSocketService.emit('end', {});
  }
}
