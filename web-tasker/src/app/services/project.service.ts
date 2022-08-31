import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  //variable to help view newly created project
  private projectAdded: Boolean = false;

  //variable to contain selected project to aid in edit component
  private capturedProject!: string;

  //variable to help if user was assigning projects and then show projects next
  private fromAssignProject!: boolean;

  constructor(private webReqService: WebRequestService) {}

  createList(title: string) {
    //send a web request to create a list
    return this.webReqService.post('lists', { title });
  }

  getLists() {
    //send a web request to get lists
    return this.webReqService.get('lists');
  }

  getUserProjects() {
    //send a web request to get user projects
    return this.webReqService.get('projects/myprojects');
  }

  getAllProjects() {
    //send a web request to get all projects
    return this.webReqService.get('projects');
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

  /**Methods used to check whether user comes from assign projects component */
  getFromAssigning() {
    return this.fromAssignProject;
  }

  setFromAssigning(bool: boolean) {
    this.fromAssignProject= bool;
  }
}
