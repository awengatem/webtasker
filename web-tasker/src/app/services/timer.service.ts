import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  constructor(
    private webReqService: WebRequestService,
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
          return this.router.navigate([`/projects/${projectId}/action`]);
        }
        /**notify user */
        return Swal.fire(
          'Complete current session first!',
          `a session is already in progress.`,
          'error'
        );
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Error!', `${err.message}.`, 'error');
      },
    });
  }

  /**method used by route guard to authorize user */
  authorizeUser(): boolean {
    let myBool = false;
    /**get the project and team ids first to check if they are authorized */
    const projectId = localStorage.getItem('capturedProjectId')!;
    const teamId = localStorage.getItem('capturedProjectTeam')!;
    /**check response first */
    this.authorizeTimer(projectId, teamId).subscribe({
      next: (response: any) => {
        const message = response.message;
        /**return true if allowed */
        if (message === 'allowed') {
          myBool = true;
        }
      },
    });
    return myBool;
  }
}
