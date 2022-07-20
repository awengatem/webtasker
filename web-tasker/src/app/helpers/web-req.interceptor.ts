import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class WebReqInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService,private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    //Handle the request
    req = this.addAuthHeader(req);

    //call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if(error instanceof HttpErrorResponse && !req.url.includes('login') && error.status === 401){
          //return this.handle401Error(req)

        }

        if (error.status === 401) {
          //401 error therefore unauthorized

          //refresh the access token

          this.authService.logout();
        }

        

        return throwError(error);
      })
    );
  }

  addAuthHeader(req: HttpRequest<any>) {
    //get access token from local storage
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

  handle401Error(req: HttpRequest<any>,next: HttpHandler){
    //get refreshed access token and reset it
    //get access token from local storage
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

/**support link
 * https://www.bezkoder.com/angular-12-refresh-token/
 */