import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TimerService } from '../services/timer.service';

@Injectable({
  providedIn: 'root',
})
export class TimerGuard implements CanActivate {
  isUserAllowed!: boolean;

  constructor(private timerService: TimerService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      this.isUserAllowed = this.timerService.authorizeUser();

      if (this.isUserAllowed) {
        resolve(true);
      } else {
        //navigate back to the component
        this.router.navigate(['/projects']);
        resolve(false);
      }
    });
  }
}
