import { Injectable } from '@angular/core';
import { ProjectService } from '../project.service';
import { TeamService } from '../team.service';
import { WebRequestService } from '../web-request.service';
import { UserAccountService } from './user-account.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectStatusService {
  /**Array used to getStatusDocs function */
  documents!: any[];
  constructor(
    private webService: WebRequestService,
    private teamService: TeamService,
    private projectService: ProjectService,
    private userAccountService: UserAccountService
  ) {}

  /**get the project status docs from api */
  getStatusDocs() {
    return new Promise((resolve, reject) => {
      this.getProjectStatus().subscribe({
        next: (documents) => {
          //console.log(this.documents);
          this.documents = documents;
          //push new fields to retrieved documents
          this.documents.forEach(
            (document) => (
              (document.username = 'Unknown'),
              (document.projectName = 'Unknown'),
              (document.teamName = 'Unknown'),
              (document.newDuration = 'Unknown'),
              (document.startTime = 'Unknown'),
              (document.finishTime = 'Unknown')
            )
          );
          //console.log(this.documents);
          //loop through the documents and assign new values
          for (let i = 0; i < this.documents.length; i++) {
            //assign user name
            this.getUserName(this.documents[i].user_account_id).then(
              (username) => {
                this.documents[i].username = username;
              }
            );
            //assign project name
            this.getProjectName(this.documents[i].project_id).then(
              (projectName) => {
                this.documents[i].projectName = projectName;
              }
            );
            //assign team name
            this.getTeamName(this.documents[i].team_id).then((teamName) => {
              this.documents[i].teamName = teamName;
            });
          }
          resolve(this.documents);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get active projects for user */
  getActiveProjects() {
    return this.webService.get('project_status/my_active');
  }

  /**get all project status docs  from db */
  getProjectStatus() {
    return this.webService.get('project_status');
  }

  /**get team name */
  getTeamName(teamId: string) {
    return new Promise((resolve, reject) => {
      this.teamService.getSpecificTeam(teamId).subscribe({
        next: (teamDoc) => {
          resolve(teamDoc.teamName);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get project name */
  getProjectName(projectId: string) {
    return new Promise((resolve, reject) => {
      this.projectService.getSpecificProject(projectId).subscribe({
        next: (projectDoc) => {
          resolve(projectDoc.projectName);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get user name */
  getUserName(userId: string) {
    return new Promise((resolve, reject) => {
      this.userAccountService.getSpecificUser(userId).subscribe({
        next: (userDoc) => {
          resolve(userDoc.username);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }
}
