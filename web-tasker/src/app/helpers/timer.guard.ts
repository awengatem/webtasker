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
      this.timerService.authorizeUser().then((message) => {
        if (message === 'allowed') {
          resolve(true);
        } else {
          this.router.navigate(['/projects']);
          resolve(false);
        }
      });
    });
  }
}
