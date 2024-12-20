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

  /**Get teams assigned to a certain supervisor */
  getSupervisorTeams(userId: string) {
    return this.webReqService.get(`supervisors/teams/${userId}`);
  }

  /**Get all projects belonging to teams assigned to a certain supervisor */
  getSupervisorProjects(userId: string) {
    return this.webReqService.get(`supervisors/projects/${userId}`);
  }

  /**Get all sessions for teams assigned to a certain supervisor*/
  getSupervisorTeamSessions(userid: string) {
    return this.webReqService.get(`supervisors/teams_sessions/${userid}`);
  }

  /**Method to add team supervisors */
  addTeamSupervisors(supervisors: any[]) {
    return this.webReqService.post(`supervisors`, supervisors);
  }

  /**Delete supevisor */
  deleteSupervisor(userId: string) {
    return this.webReqService.delete(`supervisors/user/${userId}`);
  }

  /**Delete multiple supevisors */
  deleteMultipleSupervisors(supervisorDocs: any[]) {
    return this.webReqService.post(`supervisors/delete_multiple`, {
      supervisorDocs: supervisorDocs,
    });
  }
}
