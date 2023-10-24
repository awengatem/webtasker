import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class EarningService {
  constructor(private webReqService: WebRequestService) {}

  /**Method to get calibrated earnings from api */
  getEarnings() {
    return new Promise((resolve, reject) => {
      this.getEarningDocs().subscribe({
        next: (earnings) => {
          this.calibrateEarningDocs(earnings).then((calibratedEarnings) => {
            resolve(calibratedEarnings);
          });
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  /**Calibrate earning docs */
  calibrateEarningDocs(earningDocs: any) {
    return new Promise((resolve, reject) => {
      if (earningDocs) {
        let documents = earningDocs;
        //console.log(this.documents);

        //loop through the documents and assign the date
        for (let i = 0; i < documents.length; i++) {
          //assign new start time
          this.timestampConverter(documents[i].date).then((dateTime) => {
            documents[i].date = dateTime;
          });
        }
        resolve(documents);
      }
    });
  }

  /**Get site earnings from db */
  getEarningDocs() {
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
