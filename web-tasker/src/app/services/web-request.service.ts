import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  //handle the http logic here
  readonly ROOT_URL;
  httpOptions;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000';
    this.httpOptions = {
      withCredentials: true,
    };
  }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`);
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
}
