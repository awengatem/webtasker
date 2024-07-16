import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClearUsessionsintervalGuard
  
{
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    /**Perform the action here before the user leaves the route*/
    //capture the dashboard interval to terminate
    const sessionInterval = parseInt(
      localStorage.getItem('user-sessions-interval')!
    );
    if (sessionInterval) {
      window.clearInterval(sessionInterval);
      console.log('Sessions refresh interval terminated');
    }
    localStorage.removeItem('user-sessions-interval');

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
