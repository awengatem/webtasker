import { Injectable } from '@angular/core';
import { WebRequestService } from './api/web-request.service';
//variables
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private webservice: WebRequestService) {}

  getUserAccount() {
    return this.webservice.getObserved('users/current');
  }

  clean() {
    window.sessionStorage.clear();
  }

  public saveUser(user: any) {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.sessionStorage.setItem('user-id', user._id);
  }

  public getUserOld(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
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

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }
    return false;
  }
}
