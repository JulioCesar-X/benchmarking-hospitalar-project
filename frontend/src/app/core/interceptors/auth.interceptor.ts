import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/env';
import { CookieService } from 'ngx-cookie-service';
import { LoggingService } from '../services/logging.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    private loggingService: LoggingService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cookieService.get('access_token');
    const apiReq = req.clone({
      url: `${environment.apiUrl}${req.url}`,
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });

    return next.handle(apiReq).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loggingService.error('Error during HTTP request:', error);
        return throwError(error);
      })
    );
  }
}