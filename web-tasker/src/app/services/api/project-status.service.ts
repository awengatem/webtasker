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
  documents2!: any[];
  documents3!: any[];
  documents4!: any[];
  constructor(
    private webService: WebRequestService,
    private teamService: TeamService,
    private projectService: ProjectService,
    private userAccountService: UserAccountService
  ) {}

  /**MAIN METHODS */
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
          //console.log(this.documents2);
          this.documents2 = documents;
          //push new fields to retrieved documents
          this.documents2.forEach(
            (document) => (
              (document.username = 'Unknown'),
              (document.projectName = 'Unknown'),
              (document.teamName = 'Unknown'),
              (document.newDuration = 'Unknown'),
              (document.startTime = 'Unknown'),
              (document.finishTime = 'Unknown')
            )
          );
          //console.log(this.documents2);
          //loop through the documents and assign new values
          for (let i = 0; i < this.documents2.length; i++) {
            if (this.documents2[i] != null) {
              //assign user name
              this.getUserName(this.documents2[i].user_account_id).then(
                (username) => {
                  this.documents2[i].username = username;
                }
              );
              //assign project name
              this.getProjectName(this.documents2[i].project_id).then(
                (projectName) => {
                  this.documents2[i].projectName = projectName;
                }
              );
              //assign team name
              this.getTeamName(this.documents2[i].team_id).then((teamName) => {
                this.documents2[i].teamName = teamName;
              });
              //assign new duration
              this.durationConverter(this.documents2[i].duration).then(
                (newDuration) => {
                  this.documents2[i].newDuration = newDuration;
                }
              );
              //assign new start time
              this.timestampConverter(this.documents2[i].started).then(
                (startTime) => {
                  this.documents2[i].startTime = startTime;
                }
              );

              //assign new finish time
              this.timestampConverter(this.documents2[i].finished).then(
                (finishTime) => {
                  this.documents2[i].finishTime = finishTime;
                }
              );
            }
          }
          resolve(this.documents2);
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
          //console.log(this.documents3);
          this.documents3 = documents;
          //push new fields to retrieved documents
          this.documents3.forEach(
            (document) => (
              (document.username = 'Unknown'),
              (document.projectName = 'Unknown'),
              (document.teamName = 'Unknown'),
              (document.newDuration = 'Unknown'),
              (document.startTime = 'Unknown'),
              (document.finishTime = 'Unknown')
            )
          );
          //console.log(this.documents3);
          //loop through the documents and assign new values
          for (let i = 0; i < this.documents3.length; i++) {
            //assign user name
            this.getUserName(this.documents3[i].user_account_id).then(
              (username) => {
                this.documents3[i].username = username;
              }
            );
            //assign project name
            this.getProjectName(this.documents3[i].project_id).then(
              (projectName) => {
                this.documents3[i].projectName = projectName;
              }
            );
            //assign team name
            this.getTeamName(this.documents3[i].team_id).then((teamName) => {
              this.documents3[i].teamName = teamName;
            });
            //assign new duration
            this.durationConverter(this.documents3[i].duration).then(
              (newDuration) => {
                this.documents3[i].newDuration = newDuration;
              }
            );
            //assign new start time
            this.timestampConverter(this.documents3[i].started).then(
              (startTime) => {
                this.documents3[i].startTime = startTime;
              }
            );

            //assign new finish time
            this.timestampConverter(this.documents3[i].finished).then(
              (finishTime) => {
                this.documents3[i].finishTime = finishTime;
              }
            );
          }
          resolve(this.documents3);
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
          //console.log(this.documents4);
          this.documents4 = documents;
          //push new fields to retrieved documents
          this.documents4.forEach(
            (document) => (
              (document.projectName = 'Unknown'),
              (document.teamName = 'Unknown'),
              (document.newDuration = 'Unknown'),
              (document.startTime = 'Unknown')
            )
          );
          //console.log(this.documents4);
          //loop through the documents and assign new values
          for (let i = 0; i < this.documents4.length; i++) {
            if (
              this.documents4[i].projectId != 'null' &&
              this.documents4[i].teamId != 'null'
            ) {
              //assign project name
              this.getProjectName(this.documents4[i].projectId).then(
                (projectName) => {
                  this.documents4[i].projectName = projectName;
                }
              );
              //assign team name
              this.getTeamName(this.documents4[i].teamId).then((teamName) => {
                this.documents4[i].teamName = teamName;
              });
              //assign new duration
              this.durationConverter(this.documents4[i].duration).then(
                (newDuration) => {
                  this.documents4[i].newDuration = newDuration;
                }
              );
              //assign new start time
              this.timestampConverter(this.documents4[i].started).then(
                (startTime) => {
                  this.documents4[i].startTime = startTime;
                }
              );
            } else {
              this.documents4[i].projectName = 'null';
              this.documents4[i].teamName = 'null';
              this.documents4[i].newDuration = 'null';
              this.documents4[i].startTime = 'null';
            }

            //name status
            if (this.documents4[i].status === 'null') {
              this.documents4[i].status = 'unproductive';
            }
          }
          resolve(this.documents4);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get project status docs from api specified by Projectid*/
  getStatusDocsById(projectId: string) {
    return new Promise((resolve, reject) => {
      this.getProjectStatusByProjId(projectId).subscribe({
        next: (statusDocs) => {
          resolve(statusDocs);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**get project duration*/
  getProjectDuration(projectId: string) {
    return new Promise((resolve, reject) => {
      //work on docs with specified project Id
      this.getStatusDocsById(projectId).then((statusDocs: any) => {
        let totalDuration = this.computeDurationOnStatusDocs(statusDocs);
        resolve(totalDuration);
      });
    });
  }

  /**HELPER METHODS */
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

  /**Compute specified total duration */
  computeDurationOnStatusDocs(statusDocs: any[]): number {
    let duration = 0;
    statusDocs.forEach((doc) => {
      duration += doc.duration;
    });
    return duration;
  }

  /**API CONNECTION METHODS */
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

  /**get all project status docs  from db */
  getProjectStatusByProjId(projectId: string) {
    return this.webService.get(`project_status/project/${projectId}`);
  }

  /**get recent finished (status) project status docs  from db */
  getUserStatusDocs() {
    return this.webService.get('users/status');
  }
}
