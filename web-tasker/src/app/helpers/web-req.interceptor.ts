import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject, Observable, throwError } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class WebReqInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {}

  refreshingAccessToken!: boolean;
  accessTokenRefreshed: Subject<any> = new Subject();

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
          this.handle403Error(req, next);
        }

        return throwError(error);
      })
    );
  }

  handle403Error(req: HttpRequest<any>, next: HttpHandler) {
    //get refreshed access token and reset it
    return this.tokenService.getNewToken().subscribe({
      next: (response: HttpResponse<any>) => {
        const accessToken = response.body.accessToken;

        //reset the access token
        this.tokenService.saveAccessToken(accessToken); //saves to session storage
        this.tokenService.setAccessTokenLocal(accessToken); //saves to local storage
        //window.location.reload();
        //localStorage['access-token'] = accessToken;
        req = this.addAuthHeader(req);
        return next.handle(req);
      },
      error: (err: any) => {
        console.log(err.error.message);
        if (err.status === 403) {
          this.authService.logout();
        }
      },
    });
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
