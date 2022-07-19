import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private webService: WebRequestService,
    private router: Router
  ) {}

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),//avoid multiple execution by multiple subscribers
      tap((res: HttpResponse<any>) => {
        //the auth tokens will be in the header of this response
        this.setSession(
          res.body.user._id,
          res.headers.get('x-token')
          //res.body.authTokens //aka refreshtoken
        );
        console.log("Logged in!");
        this.router.navigate(['/home']);
      })
    );
  }

  logout() {
    this.removeSession();    
    this.router.navigate(['/login']);
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
}
