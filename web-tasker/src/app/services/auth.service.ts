import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { AccountService } from './account-service.service';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  //variables
  myBool!: boolean;

  constructor(
    private http: HttpClient,
    private webService: WebRequestService,
    private router: Router,
    private accountService: AccountService
  ) {}

  login(username: string, password: string) {
    return this.webService.login(username, password).pipe(
      shareReplay(), //avoid multiple execution by multiple subscribers
      tap((res: HttpResponse<any>) => {
        //the auth tokens will be in the header of this response
        this.setSession(
          res.body.user._id,
          res.headers.get('x-token')
          //res.body.authTokens //aka refreshtoken
        );
        console.log(`${res.body.user.username} Logged in!`);
        this.router.navigate(['/home']);
      })
    );
  }

  logout() {
    const username = this.accountService.getUser().username;
    this.removeSession();
    this.accountService.clean();
    this.router.navigate(['/login']);
    console.log(`${username} Logged out!`);
    return this.webService.get('logout');
  }

  //accessor methods
  getAccessToken() {
    return localStorage.getItem('access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh-token');
  }

  //setter for access token
  setAccessToken(accessToken: string) {
    localStorage.setItem('access-token', accessToken);
  }

  private setSession(
    userId: string,
    accessToken: any
    //refreshToken: string
  ) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    //localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    //localStorage.removeItem('refresh-token');
  }

  /*dummy method to check if authheaders are set
   *request passes through the jwt middleware at backend api
   * returns 401 if not authorized
   * returns 403 if token is expired
   */
  verifyUser() {
    this.myBool = true;    
    this.accountService.getUserAccount().subscribe({
      next: (res) => {
        if(res.status === 401){
          this.myBool = false;
        }
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
    return this.myBool;
  }
}
