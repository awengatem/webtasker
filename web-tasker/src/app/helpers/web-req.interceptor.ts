import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebReqInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //Handle the request
    req = this.addAuthHeader(req);

    //call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401) {
          //401 error therefore unauthorized

          //refresh the access token

          this.authService.logout();
        }

        if (error.status === 403) {
          //403 forbidden//remember to work on this

          this.authService.logout();
        }

        return throwError(error);
      })
    );
  }

  addAuthHeader(req: HttpRequest<any>) {
    //get access token
    const token = this.authService.getAccessToken();

    if (token) {
      //append access token to request header
      return req.clone({
        setHeaders: {
          'x-token': `Bearer ${token}`,
        },
        withCredentials: true,
      });
    }
    return req;
  }
}
