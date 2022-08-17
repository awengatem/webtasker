import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  constructor() {}

  /*local storage part*/
  //accessor methods
  getIsExpanded() {
    return localStorage.getItem('isExpanded');
  }  

  getSublist() {
    return localStorage.getItem('sublist');
  }

  //setter methods
  setIsExpanded(status: string) {
    localStorage.setItem('isExpanded', status);
  }  

  setSublist(status: string) {
    localStorage.setItem('sublist', status);
  }
}
