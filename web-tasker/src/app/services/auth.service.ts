import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { AccountService } from './account-service.service';
import { TokenService } from './token.service';
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
    private accountService: AccountService,
    private tokenService: TokenService
  ) {}

  /*methods here deal with local storage*/

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
    return this.webService.get('logout').subscribe({
      next: (res) => {
        //console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private setSession(userId: string, accessToken: any) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
  }

  /*dummy method to check if authheaders are set
   *checks if the access tokens are available
   */
  verifyUser() {
    this.myBool = false;
    const token1 = this.tokenService.getAccessTokenSession();
    const token2 = this.tokenService.getAccessTokenLocal();
    if (token1 === token2 && token1 !== null) {
      this.myBool = true;
    }
    return this.myBool;
  }
}
