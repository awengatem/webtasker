import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  constructor(private webReqService: WebRequestService) {}

  /** Method to get a specified user*/
  getSpecificUser(userId: string) {
    return this.webReqService.get(`users/${userId}`);
  }

  /**Method to get all users */
  getUsers(){
    return this.webReqService.get('users');
  }
}
