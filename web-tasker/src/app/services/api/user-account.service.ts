import { Injectable } from '@angular/core';
import { WebRequestService } from '../web-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  constructor(private webReqService: WebRequestService) {}

  /** Method to get a specified project*/
  getSpecificUser(userId: string) {
    return this.webReqService.get(`users/${userId}`);
  }
}
