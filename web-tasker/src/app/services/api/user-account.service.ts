import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  constructor(private webReqService: WebRequestService) {}

  /**Method to register a new user */
  registerUser(user: object) {
    return this.webReqService.post('register', user);
  }

  /** Method to get a specified user*/
  getSpecificUser(userId: string) {
    return this.webReqService.get(`users/${userId}`);
  }

  /**Method to get all users */
  getUsers() {
    return this.webReqService.get('users');
  }

  /**Method to edit specified user */
  editUser(userId: string, userObj: any) {
    return this.webReqService.patch(`users/${userId}`, {
      username: userObj.username,
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      isProjectManager: true, //hardcoded
    });
  }

  /**Method to delete a specified user */
  deleteUser(userId: string) {
    return this.webReqService.delete(`users/${userId}`);
  }

  /**Method to delete multiple users */
  deleteMultipleUsers(userIdArr: any[]) {
    return this.webReqService.post(`users/delete_multiple`, {
      userIdArr: userIdArr,
    });
  }
}
