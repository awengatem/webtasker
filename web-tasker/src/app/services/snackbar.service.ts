import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  /**variables */
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private _snackBar: MatSnackBar) {}

  /**Multipurpose method for edits and updates */
  displaySnackbar(type: string, message: any) {
    if (type == 'error') {
      this._snackBar.open(message, 'Close', {
        duration: 2000,
        panelClass: ['red-snackbar'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    } else if (type == 'success') {
      this._snackBar.open(message, 'Close', {
        duration: 2000,
        panelClass: ['green-snackbar'],
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}
