import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from '../../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  constructor(private http: HttpClient) { }

  indexActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>('/admin/activities').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch activities')))
    );
  }


  getActivitiesPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/admin/activities/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated activities')))
    );
  }

  showActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(`/admin/activities/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch activity')))
    );
  }

  storeActivity(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>('/admin/activities', activity).pipe(
      catchError(error => throwError(() => new Error('Failed to create activity')))
    );
  }

  updateActivity(id: number, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`/admin/activities/${id}`, activity).pipe(
      catchError(error => throwError(() => new Error('Failed to update activity')))
    );
  }

  destroyActivity(id: number): Observable<any> {
    return this.http.delete(`/admin/activities/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete activity')))
    );
  }
}
