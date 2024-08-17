import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor() {}

  /**Method to remove unnecessary white space */
  clean(input: string) {
    return input
      .replace(/^\s\s*/, '') // Remove Preceding white space
      .replace(/\s\s*$/, '') // Remove Trailing white space
      .replace(/([\s]+)/g, ' '); // Replace remaining white space with single space
  }

  /**Method to clean sign up credentials */
  deepClean(input: string) {
    return input;
    // return input.split(' ').join('');
    //return input.replace(/\s/g,'');
  }

  /**Set the team id in local storage to aid in the team-info component */
  captureTeamId(teamId: string) {
    /**store this in localstorage to aid in next compomnent */
    localStorage.setItem('capturedTeamId', teamId);
  }

  /**Get the state of the sidenav from local storage */
  getSidenavState() {
    return localStorage.getItem('isExpanded');
  }

  /**Set the state of the sidenav to local storage */
  setSidenavState(status: string) {
    localStorage.setItem('isExpanded', status);
  }

  /**Get the sidenav cascaded admin menu status */
  getSublist() {
    return localStorage.getItem('sublist');
  }

  /**Set the sidenav cascaded admin menu status */
  setSublist(status: string) {
    localStorage.setItem('sublist', status);
  }

  /**Get Supervisor team-page active tab */
  getSupTeamTab() {
    return localStorage.getItem('supteamtab');
  }

  /**Set Supervisor team-page active tab */
  setSupTeamTab(activeTab: string) {
    return localStorage.setItem('supteamtab', activeTab);
  }
}
