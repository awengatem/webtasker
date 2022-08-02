import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private webReqService: WebRequestService) { }

  createList(title: string){
    //send a web request to create a list
    return this.webReqService.post('lists',{title});
  }

  getLists(){
    //send a web request to get lists
    return this.webReqService.get('lists');
  }

  getProjects(){
    //send a web request to get user projects
    return this.webReqService.get('projects/myprojects');
  }
}
