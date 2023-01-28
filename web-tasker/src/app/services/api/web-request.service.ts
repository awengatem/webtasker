import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { url } from 'src/app/configs';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  //handle the http logic here
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = url.ROOT_URL;
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
