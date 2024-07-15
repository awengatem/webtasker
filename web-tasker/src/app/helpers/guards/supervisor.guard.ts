import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SupervisorGuard  {
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise((resolve, reject) => {
        this.authService.verifySupervisor().then((result) => {
          if (result === true) {
            resolve(true);
          } else {
            /**notify user */
            Swal.fire('Unauthorized!', `You are not a supervisor.`, 'warning');
            this.router.navigate(['/home']);
            resolve(false);
          }
        });
      });
  }
  
}
