import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Activity } from '../models/activity.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private apiUrl = 'http://localhost:8001';
  //private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com';

  constructor(private http: HttpClient) { }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/activities`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Error fetching activities:', error);
          return throwError(() => new Error('Failed to fetch activities'));
        })
      );
  }
}
