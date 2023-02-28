import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { AccountService } from './account-service.service';
import { StatusService } from './status.service';
import { TokenService } from './token.service';
import { WebRequestService } from './api/web-request.service';
import { SocketIoService } from './socket.io.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variables
  myBool!: boolean;
  readonly positive: string = 'true';
  readonly negative: string = 'false';

  constructor(
    private http: HttpClient,
    private webService: WebRequestService,
    private webSocketService: SocketIoService,
    private router: Router,
    private accountService: AccountService,
    private statusService: StatusService
  ) {}

  /*methods here deal with local storage*/

  login(username: string, password: string) {
    return this.webService.login(username, password).pipe(
      shareReplay(), //avoid multiple execution by multiple subscribers
      tap((res: HttpResponse<any>) => {
        const token = res.headers.get('x-token');

        /**get the user from token */
        const user = this.getLoginUser(token);

        //the auth tokens will be in the header of this response
        this.setSession(
          user._id,
          token
          //res.body.authTokens //aka refreshtoken
        );
        //set sidenav statuses
        this.setSidenavValues();
        //set home action button status defaults
        //this.setButtonStatus();

        console.log(`${res.body.user.username} Logged in!`);
        this.router.navigate(['/home']);
      })
    );
  }

  logout() {
    const username = this.accountService.getUser().username;
    this.removeSession();
    //request timerbuttons from server
    // this.webSocketService.emit('end', {});

    this.router.navigate(['/login']);
    if (username) {
      console.log(`${username} Logged out!`);
    }
    return this.webService.get('logout').subscribe({
      next: (res) => {
        //console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //deals with local storage
  private setSession(userId: string, accessToken: any) {
    //clear any previous data if any
    this.removeSession();
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
  }

  /**Sets sidenav defaults to local storage
   * Helps preserve sidenav status after refresh
   */
  private setSidenavValues() {
    localStorage.setItem('isExpanded', this.positive);
    localStorage.setItem('sublist', this.negative);
  }

  /**Sets session button defaults to local storage
   * Helps control the start and end buttons
   */
  private setButtonStatus() {
    this.statusService.setEnded('false');
    this.statusService.setStarted('false');
    this.statusService.setPaused('false');
  }

  /**method to clear Local and session storage */
  private removeSession() {
    localStorage.clear();
    this.accountService.clean();
  }

  /**Getting the user from access token */
  private getLoginUser(token: any) {
    if (token) {
      const document = JSON.parse(window.atob(token.split('.')[1]));
      return document.user;
    }
  }
  /**Getting the user from access token */
  public getUser() {
    /**Get access token from storage */
    const token = localStorage.getItem('access-token');
    if (token) {
      const document = JSON.parse(window.atob(token.split('.')[1]));
      return document.user;
    }
  }

  /**method used by auth guard to check if the user is authorized*/
  verifyUser() {
    return new Promise((resolve, reject) => {
      /**check from db if user is authenticated */
      /**Get the user from token */
      const user = this.getUser();
      if (user) {
        const role = user.role;
        //allow both supervisor and manager
        if (role === 'supervisor' || role === 'manager' || role === 'user') {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        this.logout();
        reject();
      }
    });
  }

  /**method used by supervisor guard to authorize admins and supervisors */
  verifySupervisor() {
    return new Promise((resolve, reject) => {
      /**check if user is an admin */
      /**Get the user from token */
      const user = this.getUser();
      if (user) {
        const role = user.role;
        //allow both supervisor and manager
        if (role === 'supervisor' || role === 'manager') {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        reject();
      }
    });
  }

  /**method used by manager guard to authorize managers */
  verifyManager() {
    return new Promise((resolve, reject) => {
      /**check if user is an admin */
      /**Get the user from token */
      const user = this.getUser();
      if (user) {
        const role = user.role;
        //allow manager only
        if (role === 'manager') {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        reject();
      }
    });
  }
}
