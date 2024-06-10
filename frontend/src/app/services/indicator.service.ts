import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Indicator } from '../models/indicator.model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  //private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com';
  private apiUrl = 'http://localhost:8001';

  constructor(private http: HttpClient) { }

  getIndicators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/indicators`).pipe(
      catchError(error => {
        console.error('Error fetching indicators:', error);
        return throwError(() => new Error('Failed to fetch indicators'));
      })
    );
  }

  getAllSaiIndicators(serviceId: number, activityId: number, date:Date): Observable<any[]> {
    // Configurando os parâmetros HTTP
    let params = new HttpParams();
    params = params.append('serviceId', serviceId.toString());
    params = params.append('activityId', activityId.toString());
    params = params.append('date', date.toString());

    return this.http.get<any[]>(`${this.apiUrl}/sai/indicators`, { params: params }).pipe(
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

