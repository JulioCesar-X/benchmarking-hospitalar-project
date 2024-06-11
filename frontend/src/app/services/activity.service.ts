import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from '../models/activity.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>('/activities', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(error => {
        console.error('Error fetching activities:', error);
        return throwError(() => new Error('Failed to fetch activities'));
      })
    );
  }
}
