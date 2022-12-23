import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { TeamService } from './team.service';
import { WebRequestService } from './web-request.service';
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

  /**get all the project status docs from api */
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
            //assign new duration
            this.durationConverter(this.documents[i].duration).then(
              (newDuration) => {
                this.documents[i].newDuration = newDuration;
              }
            );
            //assign new start time
            this.timestampConverter(this.documents[i].started).then(
              (startTime) => {
                this.documents[i].startTime = startTime;
              }
            );

            //assign new finish time
            this.timestampConverter(this.documents[i].finished).then(
              (finishTime) => {
                this.documents[i].finishTime = finishTime;
              }
            );
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

  /**get active project status docs from api */
  getActiveStatusDocs() {
    return new Promise((resolve, reject) => {
      this.getAllActiveProjects().subscribe({
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
            if (this.documents[i] != null) {
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
              //assign new duration
              this.durationConverter(this.documents[i].duration).then(
                (newDuration) => {
                  this.documents[i].newDuration = newDuration;
                }
              );
              //assign new start time
              this.timestampConverter(this.documents[i].started).then(
                (startTime) => {
                  this.documents[i].startTime = startTime;
                }
              );

              //assign new finish time
              this.timestampConverter(this.documents[i].finished).then(
                (finishTime) => {
                  this.documents[i].finishTime = finishTime;
                }
              );
            }
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

  /**get recently finished(status) project status docs from api */
  getRecentFDocs() {
    return new Promise((resolve, reject) => {
      this.getRFinishedProjects().subscribe({
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
            //assign new duration
            this.durationConverter(this.documents[i].duration).then(
              (newDuration) => {
                this.documents[i].newDuration = newDuration;
              }
            );
            //assign new start time
            this.timestampConverter(this.documents[i].started).then(
              (startTime) => {
                this.documents[i].startTime = startTime;
              }
            );

            //assign new finish time
            this.timestampConverter(this.documents[i].finished).then(
              (finishTime) => {
                this.documents[i].finishTime = finishTime;
              }
            );
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

  /**get user status statistics for all users from api */
  getUserStatus() {
    return new Promise((resolve, reject) => {
      this.getUserStatusDocs().subscribe({
        next: (documents) => {
          //console.log(this.documents);
          this.documents = documents;
          //push new fields to retrieved documents
          this.documents.forEach(
            (document) => (
              (document.projectName = 'Unknown'),
              (document.teamName = 'Unknown'),
              (document.newDuration = 'Unknown'),
              (document.startTime = 'Unknown')
            )
          );
          //console.log(this.documents);
          //loop through the documents and assign new values
          for (let i = 0; i < this.documents.length; i++) {
            if (
              this.documents[i].projectId != 'null' &&
              this.documents[i].teamId != 'null'
            ) {
              //assign project name
              this.getProjectName(this.documents[i].projectId).then(
                (projectName) => {
                  this.documents[i].projectName = projectName;
                }
              );
              //assign team name
              this.getTeamName(this.documents[i].teamId).then((teamName) => {
                this.documents[i].teamName = teamName;
              });
              //assign new duration
              this.durationConverter(this.documents[i].duration).then(
                (newDuration) => {
                  this.documents[i].newDuration = newDuration;
                }
              );
              //assign new start time
              this.timestampConverter(this.documents[i].started).then(
                (startTime) => {
                  this.documents[i].startTime = startTime;
                }
              );
            } else {
              this.documents[i].projectName = 'null';
              this.documents[i].teamName = 'null';
              this.documents[i].newDuration = 'null';
              this.documents[i].startTime = 'null';
            }

            //name status
            if (this.documents[i].status === 'null') {
              this.documents[i].status = 'unproductive';
            }
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

  /**get all active projects */
  getAllActiveProjects() {
    return this.webService.get('project_status/active');
  }

  /**get active projects for user */
  getActiveProjects() {
    return this.webService.get('project_status/my_active');
  }

  /**get all project status docs  from db */
  getProjectStatus() {
    return this.webService.get('project_status');
  }

  /**get recent finished (status) project status docs  from db */
  getRFinishedProjects() {
    return this.webService.get('project_status/recent');
  }

  /**get recent finished (status) project status docs  from db */
  getUserStatusDocs() {
    return this.webService.get('users/status');
  }

  /**get team name */
  getTeamName(teamId: string) {
    return new Promise((resolve, reject) => {
      this.teamService.getSpecificTeam(teamId).subscribe({
        next: (teamDoc: any) => {
          if (teamDoc) resolve(teamDoc.teamName);
        },
        error: (err: any) => {
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
          if (projectDoc) resolve(projectDoc.projectName);
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
          if (userDoc) resolve(userDoc.username);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**convert duration to specified calibrations */
  durationConverter(duration: number) {
    return new Promise((resolve, reject) => {
      let seconds = this.returnData(Math.floor(duration / 1000) % 60);
      let minutes = this.returnData(Math.floor(duration / 60000) % 60);
      let hours = this.returnData(Math.floor(duration / 3600000) % 60);
      resolve(`${hours}Hrs ${minutes}Mins ${seconds}Sec`);
    });
  }

  /**uniforms the returned data */
  returnData(input: any) {
    return input >= 10 ? input : `0${input}`;
  }

  /**convert timestamps to human readable */
  timestampConverter(timestamp: number) {
    return new Promise((resolve, reject) => {
      if (timestamp === 0) {
        resolve('null');
      }
      const date = new Date(timestamp);
      resolve(date);
    });
  }
}
