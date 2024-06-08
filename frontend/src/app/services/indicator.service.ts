import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Indicator } from '../models/indicator.model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com';
  //private apiUrl = 'http://localhost:8001';

  constructor(private http: HttpClient) { }

  getIndicators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/indicators`).pipe(
      catchError(error => {
        console.error('Error fetching indicators:', error);
        return throwError(() => new Error('Failed to fetch indicators'));
      })
    );
  }

  postIndicator(indicatorData: Indicator): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/indicators`, indicatorData);
  }
}

