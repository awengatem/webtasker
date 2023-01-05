import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    /**Perform the action here before the user leaves the route*/
    //capture the dashboard interval to terminate
    const dashInterval = parseInt(localStorage.getItem('dashboard-interval')!);
    if (dashInterval) {
      window.clearInterval(dashInterval);
      console.log('refresh interval terminated');
    }
    localStorage.removeItem('sublist');

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
