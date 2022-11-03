import { Injectable } from '@angular/core';
import { WebRequestService } from '../web-request.service';

@Injectable({
  providedIn: 'root',
})
export class DispositionService {
  constructor(private webReqService: WebRequestService) {}

  /**get all dispositions */
  getDispositions() {
    return this.webReqService.get('dispositions');
  }

  /**get a specific disposition*/
  getSpecificDisposition(userId: string) {
    return this.webReqService.get(`dispositions/${userId}`);
  }

  /**send a web request to create a disposition */
  createDisposition(reason: string) {
    return this.webReqService.post('dispositions', { reason: reason });
  }
}
