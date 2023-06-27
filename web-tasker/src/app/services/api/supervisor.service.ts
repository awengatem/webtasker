import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  constructor(private webReqService: WebRequestService) {}
}
