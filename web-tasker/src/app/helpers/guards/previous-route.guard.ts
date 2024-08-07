import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { RouteService } from 'src/app/services/route.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PreviousRouteGuard {
  constructor(private routeService: RouteService) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    /**Perform the action here before the user leaves the route*/
    /** capture the route and add to local storage */
    const currentUrl = this.routeService.getCurrentUrl();
    currentUrl ? localStorage.setItem('currentUrl', currentUrl) : false;

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
