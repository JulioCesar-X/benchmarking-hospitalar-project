import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CacheService } from '../cache.service';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(
    private http: HttpClient,
    private cacheService: CacheService,
    private loggingService: LoggingService
  ) { }

  private getCacheKey(id: number): string {
    return `record-${id}`;
  }

  updateRecord(id: number, record: any): Observable<any> {
    return this.http.put(`/records/${id}`, record).pipe(
      tap(response => {
        const cacheKey = this.getCacheKey(id);
        if (response !== null && response !== undefined) {
          this.cacheService.set(cacheKey, response);
        }
      }),
      catchError(error => {
        this.loggingService.error('Error updating record:', error);
        return throwError(() => new Error('Failed to update record'));
      })
    );
  }

  storeRecord(record: any): Observable<any> {
    return this.http.post('/records', record).pipe(
      catchError(error => {
        this.loggingService.error('Error storing record:', error);
        return throwError(() => new Error('Failed to store record'));
      })
    );
  }

  getRecord(id: number): Observable<any> {
    const cacheKey = this.getCacheKey(id);
    if (this.cacheService.has(cacheKey)) {
      return of(this.cacheService.get(cacheKey));
    } else {
      return this.http.get(`/records/${id}`).pipe(
        tap(response => {
          if (response !== null && response !== undefined) {
            this.cacheService.set(cacheKey, response);
          }
        }),
        catchError(error => {
          this.loggingService.error('Error fetching record:', error);
          return throwError(() => new Error('Failed to fetch record'));
        })
      );
    }
  }
}