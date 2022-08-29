import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  //variable to help view newly created team
  private teamAdded: Boolean = false;

  //variable to contain selected team to aid in edit component
  private capturedTeam!: string;

  constructor(private webReqService: WebRequestService) {}

  getSpecificTeam(teamId: string) {
    //send a web request to get a specified team
    return this.webReqService.get(`teams/${teamId}`);
  }

  getAllTeams() {
    //send a web request to get user teams
    return this.webReqService.get('teams');
  }

  createTeam(teamName: string) {
    //send a web request to create a team
    return this.webReqService.post('teams', { teamName });
  }

  editTeam(teamId: string, newTeam: string) {
    return this.webReqService.patch(`teams/${teamId}`, {
      teamName: newTeam,
    });
  }

  deleteTeam(teamId: string) {
    return this.webReqService.delete(`teams/${teamId}`);
  }

  /**Methods used by teamAdded above */
  getAddStatus() {
    return this.teamAdded;
  }

  setAddStatus(status: Boolean) {
    this.teamAdded = status;
  }

  /**Methods used by capturedTeam above */
  getCapturedTeam() {
    return this.capturedTeam;
  }

  setCapturedTeam(team: string) {
    this.capturedTeam = team;
  }

  /**Method to get team projects */
  getTeamProjects(teamId: string) {
    return this.webReqService.get(`teams/projects/${teamId}`);
  }

  /**Method to get team members */
  getTeamMembers(teamId: string) {
    return this.webReqService.get(`team_members/${teamId}`);
  }

  /**Method to add team members */
  addTeamMembers(members: any[]) {
    return this.webReqService.post(`team_members`, members);
  }

  /**Method to add team projects */
  assignTeamProjects(teamId: string, projects: any[]) {
    return this.webReqService.patch(`teams/projects/${teamId}`, {
      projects: projects,
    });
  }

  /**Method to get users */
  getUsers() {
    return this.webReqService.get(`users`);
  }

   /**Method to delete specified team member */
   deleteTeamMember(teamId: string,userId: string) {
    return this.webReqService.delete(`team_members/${teamId}/${userId}`);
  }
}
