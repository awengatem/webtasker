import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private webReqService: WebRequestService) { }

  createProject(title: string){
    //send a web request to create a project
    return this.webReqService.post('lists',{title});
  }

  getProject(){
    //send a web request to get a project
    return this.webReqService.get('lists');
  }
}
