import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class EarningService {

  constructor(private webReqService: WebRequestService) { }

  /**Get site earnings from db */
  getEarnings() {
    return this.webReqService.get('earnings');
  }
}
