import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(private webService: WebRequestService) {}

  /**API CONNECTION METHODS */
  /**get all sites */
  getSites() {
    return this.webService.get('sites');
  }

  /**get county sites */
  getCountySites(countyNumber: string) {
    return this.webService.post('sites/county', { countyNumber });
  }
}
