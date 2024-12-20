import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class WebReqInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
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
      error: (err: any) => {
        console.log(err.error.message);
        if (err.status === 403) {
          this.authService.logout();
        }
      },
    });
  }

  /**this should work but it doesnt work
   * handle403Error(req: HttpRequest<any>, next: HttpHandler) {
      //get refreshed access token and reset it
      this.tokenService.getNewToken().pipe(
        switchMap((response: HttpResponse<any>) => {
          const accessToken = response.body.accessToken;
  
          //reset the access token
          this.tokenService.saveAccessToken(accessToken); //saves to session storage
          this.tokenService.setAccessTokenLocal(accessToken); //saves to local storage
  
          // Clone the request and add the new access token
          const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
          });
  
          // Resend the request with the new access token
          return next.handle(clonedRequest);
        }),
        catchError((err) => {
          console.log(err.error.message);
          if (err.status === 403) {
            this.authService.logout();
          }
          return throwError(err);
        })
      );
    }*/

  /*
  *suggested method to handle resending of request after refreshing token
  handle403Error(req: HttpRequest<any>) {
    if (this.refreshingAccessToken) {
      return new Observable((observer)=>{
        this.accessTokenRefreshed.subscribe(()=>{
          //this code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    } else {
      this.refreshingAccessToken = true;
      //get refreshed access token and reset it
      return this.tokenService.getNewToken().subscribe({
        next: (response: HttpResponse<any>) => {
          const accessToken = response.body.accessToken;

          //reset the access token
          this.tokenService.saveAccessToken(accessToken); //saves to session storage
          this.tokenService.setAccessTokenLocal(accessToken); //saves to local storage
          //window.location.reload();
          //localStorage['access-token'] = accessToken;
          this.accessTokenRefreshed.next;
        },
        error: (err) => {
          console.log(err.error.message);
          if (err.status === 403) {
            this.authService.logout();
          }
        },
      });
    }    
  }
  */

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
