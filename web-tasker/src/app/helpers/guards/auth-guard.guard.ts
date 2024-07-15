import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      this.authService
        .verifyUser()
        .then((result) => {
          if (result === true) {
            resolve(true);
          } else {
            this.authService.logout();
            resolve(false);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
