import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  /**local variables*/
  documents!: any[];

  //variable to help view newly created project
  private projectAdded: Boolean = false;

  //variable to contain selected project to aid in edit component
  private capturedProject!: string;

  //variable to contain selected project's team to aid in deciding teamId for timer
  private capturedProjectTeam!: string;

  //variable to help if user was assigning projects and then show projects next
  private fromAssignProject!: boolean;

  constructor(private webReqService: WebRequestService) {}

  /**Method to return projects with specialized
   *  formatting to be used with project status */
  /**Getting all projects */
  getProjects() {
    return new Promise<any>((resolve, reject) => {
      this.getAllProjects().subscribe({
        next: (documents: any) => {
          this.documents = documents;
          //add additional properties
          this.documents.forEach(
            (document: any) => (
              (document.members = 0),
              (document.teamCount = 0),
              (document.status = 'Unknown'),
              (document.duration = 0),
              (document.userPerc = 0)
            )
          );
          resolve(this.documents);
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
      //get project members
      // this.getProjectMembers();
    });
  }

  createList(title: string) {
    //send a web request to create a list
    return this.webReqService.post('lists', { title });
  }

  getLists() {
    //send a web request to get lists
    return this.webReqService.get('lists');
  }

  /** Method to get a specified project*/
  getSpecificProject(projectId: string) {
    return this.webReqService.get(`projects/${projectId}`);
  }

  getUserProjects() {
    //send a web request to get user projects
    return this.webReqService.get('projects/myprojects');
  }

  getAllProjects() {
    //send a web request to get all projects
    return this.webReqService.get('projects');
  }

  /**Method to get project members */
  getProjectMembers(projectId: string) {
    return this.webReqService.get(`projects/members/${projectId}`);
  }

  createProject(projectName: string) {
    //send a web request to create a project
    return this.webReqService.post('projects', { projectName });
  }

  editProject(projId: string, newProject: string) {
    return this.webReqService.patch(`projects/${projId}`, {
      projectName: newProject,
    });
  }

  deleteProject(projId: string) {
    return this.webReqService.delete(`projects/${projId}`);
  }

  /**Methods used by projectAdded above */
  getAddStatus() {
    return this.projectAdded;
  }

  setAddStatus(status: Boolean) {
    this.projectAdded = status;
  }

  /**Methods used by capturedProject above */
  getCapturedProject() {
    return this.capturedProject;
  }

  setCapturedProject(project: string) {
    this.capturedProject = project;
  }

  /**Methods used by capturedProjectTeam above */
  getCapturedProjectTeam() {
    return this.capturedProjectTeam;
  }

  setCapturedProjectTeam(teamId: string) {
    this.capturedProjectTeam = teamId;
  }

  /**Methods used to check whether user comes from assign projects component */
  getFromAssigning() {
    return this.fromAssignProject;
  }

  setFromAssigning(bool: boolean) {
    this.fromAssignProject = bool;
  }
}
