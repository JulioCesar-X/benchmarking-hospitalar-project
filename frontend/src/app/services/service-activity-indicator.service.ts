import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class ServiceActivityIndicatorService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getServiceActivityIndicators(): any {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });

    return this.http.get<any>('/sai', { headers: headers, withCredentials: true })
      .pipe(
        map(response => response),
        catchError(error => {
          console.error('Error fetching service activity indicators:', error);
          return throwError(() => new Error('Failed to fetch service activity indicators'));
        })
      );
  }
}
