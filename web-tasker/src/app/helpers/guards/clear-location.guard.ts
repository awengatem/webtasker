import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClearLocationGuard
  
{
  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    /**Perform the action here before the user leaves the route*/
    //clear previous location
    window.sessionStorage.removeItem('fromMng');
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
