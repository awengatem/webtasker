import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  constructor(private webReqService: WebRequestService) {}

  /**Get all supervisors from db */
  getSupervisors() {
    return this.webReqService.get('users/supervisors');
  }

  /**Get supervisors belonging to a certain team */
  getTeamSupervisors(teamId: string) {
    return this.webReqService.get(`supervisors/${teamId}`);
  }

  /**Delete supevisor */
  deleteSupervisor(userId: string) {
    return this.webReqService.delete(`supervisors/user/${userId}`);
  }
}
