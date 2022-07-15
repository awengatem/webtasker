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
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        //the auth tokens will be in the header of this response
        this.setSession(
          res.body.user._id,
          res.headers.get('X-Token')
          //res.body.authTokens //aka refreshtoken
        );
        console.log("Logged in!");
      })
    );
  }

  logout() {
    this.removeSession();
  }

  //accessor methods
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  //setter for access token
  setAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
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
