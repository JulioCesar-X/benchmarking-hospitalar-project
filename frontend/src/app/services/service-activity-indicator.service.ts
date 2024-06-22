import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Filter } from '../models/Filter.model';


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
  getAllIn(filter: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.cookieService.get('access_token')}`
    });
    const params = new HttpParams()
      .set('serviceId', filter.serviceId)
      .set('activityId', filter.activityId)
      .set('indicatorId', filter.indicatorId)
      .set('month', filter.month.toString())
      .set('year', filter.year.toString());

    return this.http.get<{ services: any }>('/sai/allin', { headers, params, withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error fetching data:', error);
          return throwError(() => new Error('Failed to fetch data'));
        })
      );
  }
}
