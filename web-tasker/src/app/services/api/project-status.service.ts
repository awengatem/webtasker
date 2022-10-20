import { Injectable } from '@angular/core';
import { WebRequestService } from '../web-request.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectStatusService {
  constructor(private webService: WebRequestService) {}

  /**get active projects for user */
  getActiveProjects() {
    return this.webService.get('project_status/my_active');
  }
}
