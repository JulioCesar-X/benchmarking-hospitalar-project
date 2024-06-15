import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from '../models/activity.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient, private cookieService: CookieService) { }

    //para testar para passar o user a ser editado JMS...............
    private activityDataSource = new BehaviorSubject<any>(null); // Use BehaviorSubject for initial value
    activityData$ = this.activityDataSource.asObservable();
  
    setActivityData(data: any) {
      this.activityDataSource.next(data);
    }
    //.................................JMS

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

  createActivity(data: any): Observable<any> {
    console.log(data)
    return this.http.post('admin/activities', data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateActivity(id: number, data: any): Observable<any> {
    console.log(data)
    return this.http.put(`admin//${id}`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`,
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteActivity(id: number): Observable<any> {
    return this.http.delete<void>(`admin/activities/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: HttpErrorResponse): Observable < never > {
    let errorMessage = 'Unknown error occurred. Please try again.';
    if(error.error instanceof ErrorEvent) {
    console.error('Client-side error:', error.error.message);
    errorMessage = `An error occurred: ${error.error.message}`;
  } else {
    console.error(`Server returned code ${error.status}, body was: ${error.error}`);
    errorMessage = `Error returned from server: ${error.error.message}`;
  }
  return throwError(() => new Error(errorMessage));
    }
}
