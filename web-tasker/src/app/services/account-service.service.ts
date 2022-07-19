import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private webservice: WebRequestService) { }

  getUserAccount(){
    return this.webservice.get('users/current')
  }

  clean(){
    window.sessionStorage.clear();
  }

  public saveUser(user: any){
    window.sessionStorage.removeItem('USER_KEY');
    window.sessionStorage.setItem('USER_KEY',JSON.stringify(user));
  }

  public getUser(): any{
    const user = window.sessionStorage.getItem('USER_KEY');
    if(user){
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean{
    const user = window.sessionStorage.getItem('USER_KEY');
    if(user){
      return true;
    }
    return false;
  }
}
