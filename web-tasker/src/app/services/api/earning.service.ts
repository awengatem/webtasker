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

  /**delete earning document from db */
  deleteEarning(id: string) {
    return this.webReqService.delete(`earnings/${id}`);
  }

  /**delete multiple earnings documents from db */
  deleteMultipleEarnings(idArr: any[]) {
    return this.webReqService.post(`earnings/delete_multiple`, {
      earningsIdArr: idArr,
    });
  }

  /**convert timestamps to human readable */
  timestampConverter(timestamp: number) {
    return new Promise((resolve, reject) => {
      if (timestamp === 0) {
        resolve('null');
      }
      const date = new Date(timestamp);
      // const newDate = date.toLocaleString();
      resolve(date.toLocaleString());
    });
  }
}
