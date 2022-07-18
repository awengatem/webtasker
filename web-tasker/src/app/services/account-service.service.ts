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
}
