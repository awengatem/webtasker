import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class CountyService {
  constructor(private webService: WebRequestService) {}

  /**API CONNECTION METHODS */
  /**get all counties */
  getCounties() {
    return this.webService.get('counties');
  }

  /**get county of a given site */
  getCountyOfSite(countyNumber: string) {
    return this.webService.get(`counties/county/${countyNumber}`);
  }
}
