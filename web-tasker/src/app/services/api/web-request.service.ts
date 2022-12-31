import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  //handle the http logic here
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    /**for development purpose
     * also accepts cookies
     */
    this.ROOT_URL = 'http://127.0.0.1:3000';

    /**for production testing purpose
     * rejects cookies but will fix later
     */
    // this.ROOT_URL = 'http://192.168.5.120:3000';
  }

  get(uri: string): Observable<any> {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
    //.pipe(retry(2), catchError(this.handleError));
  }

  getObserved(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`, { observe: 'response' });
  }

  post(uri: string, payload: object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload);
  }

  patch(uri: string, payload: object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`);
  }

  deleteWithArgs(uri: string,payload: object) {
    return this.http.delete(`${this.ROOT_URL}/${uri}`,payload);
  }


  login(username: string, password: string) {
    return this.http.post(
      `${this.ROOT_URL}/login`,
      { username, password },
      { observe: 'response' }
    );
  }

  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
