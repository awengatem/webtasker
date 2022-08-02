import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'jquery';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class WebReqInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //Handle the request
    req = this.addAuthHeader(req);
    req = this.addCredentials(req);

    //call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        /**restrict access if unauthorized */
        if (error.status === 401) {
          //401 error therefore unauthorized
          this.authService.logout();
        }

        /**refresh access token if expired */
        if (
          error instanceof HttpErrorResponse &&
          !req.url.includes('login') &&
          error.status === 403
        ) {
          this.handle403Error(req);          
        }

        return throwError(error);
      })
    );
  }

  addAuthHeader(req: HttpRequest<any>) {
    //get access token from local storage
    const token = this.tokenService.getAccessTokenLocal();

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

  handle403Error(req: HttpRequest<any>) {
    //get refreshed access token and reset it
    return this.tokenService.getNewToken().subscribe({
      next: (response: HttpResponse<any>) => {
        const accessToken = response.body.accessToken;

        //reset the access token
        this.tokenService.saveAccessToken(accessToken); //saves to session storage
        this.tokenService.setAccessTokenLocal(accessToken); //saves to local storage
        //window.location.reload();
        //localStorage['access-token'] = accessToken;
      },
      error: (err) => {
        console.log(err.error.message);
        if(err.status === 403){
          this.authService.logout();
        }
      },
    });
  }

  //method to set credentials to true on all requests
  addCredentials(req: HttpRequest<any>) {
    return req.clone({
      withCredentials: true,
    });
  }
}

/**support link
 * https://www.bezkoder.com/angular-12-refresh-token/
 */
