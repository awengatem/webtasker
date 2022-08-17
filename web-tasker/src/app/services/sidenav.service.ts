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

  getIsOpen() {
    return localStorage.getItem('isOpen');
  }

  getSublist() {
    return localStorage.getItem('sublist');
  }

  //setter methods
  setIsExpanded(status: string) {
    localStorage.setItem('isExpanded', status);
  }

  setIsOpen(status: string) {
    localStorage.setItem('isOpen', status);
  }

  setSublist(status: string) {
    localStorage.setItem('sublist', status);
  }
}
