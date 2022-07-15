import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebReqInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any>{
    //Handle the request
    req = this.addAuthHeader(req);

    //call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        return throwError(error);
      })
    )
  }

  addAuthHeader(req: HttpRequest<any>) {
    //get access token
    const token = this.authService.getAccessToken();

    if (token) {
      //append access token to request header
      return req.clone({
        setHeaders: {
          'X-Token': token,
        }
      });
    }
    return req;
  }
}
