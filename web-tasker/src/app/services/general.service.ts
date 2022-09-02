import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor() { }

  /**Method to remove unnecessary white space */
  clean(input: string) {
    return input
      .replace(/^\s\s*/, '') // Remove Preceding white space
      .replace(/\s\s*$/, '') // Remove Trailing white space
      .replace(/([\s]+)/g, ' '); // Replace remaining white space with single space
  }  
}
