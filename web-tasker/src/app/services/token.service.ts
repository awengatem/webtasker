import { Injectable } from '@angular/core';
import { AccountService } from './account-service.service';
//variables
const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private accountService: AccountService) { }

  signOut(){
    window.sessionStorage.clear();
  }

  public saveAccessToken(token: string){
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY,token);
    const user = this.accountService.getUser();
    if(user.id){
      this.accountService.saveUser({...user,accessToken:token});
    }
  }

  public getAccessToken(): string | null{
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveRefreshToken(token: string){
    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    window.sessionStorage.setItem(REFRESHTOKEN_KEY,token);
  }

  public getRefreshToken(): string | null{
    return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
  }
}
