import { Injectable } from '@angular/core';
import { AccountService } from './account-service.service';
import { WebRequestService } from './web-request.service';
//variables
const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(
    private accountService: AccountService,
    private webService: WebRequestService
  ) {}

  /*session storage part*/
  signOut() {
    window.sessionStorage.clear();
  }

  public saveAccessToken(token: string) {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    const user = this.accountService.getUser();
    if (user.id) {
      this.accountService.saveUser({ ...user, accessToken: token });
    }
  }

  public getAccessTokenSession(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string) {
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }

  /*local storage part*/
  //accessor methods
  getAccessTokenLocal() {
    return localStorage.getItem('access-token');
  }

  //setter for access token
  setAccessTokenLocal(accessToken: string) {
    localStorage.setItem('access-token', accessToken);
  }


  /*gets new access token from server*/
  getNewToken() {
    return this.webService.getObserved('refresh');
  }
}
