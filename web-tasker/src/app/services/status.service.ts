import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor() {}

  /**Setter for status variables */
  //injected in the auth service
  setPaused(status: string) {
    localStorage.setItem('paused', status);
  }

  setStarted(status: string) {
    localStorage.setItem('started', status);
  }

  setEnded(status: string) {
    localStorage.setItem('ended', status);
  }

  /**Getter for status variables */
  getPaused() {
    return localStorage.getItem('paused');
  }

  getStarted() {
    return localStorage.getItem('started');
  }

  getEnded() {
    return localStorage.getItem('ended');
  }

  //Clear Variables
  removeStarted(){
    localStorage.removeItem('started');
  }
}
