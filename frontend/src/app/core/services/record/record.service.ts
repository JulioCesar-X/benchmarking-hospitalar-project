import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private http: HttpClient) { }

  updateRecord(id: number, record: any): Observable<any> {
    return this.http.put(`/records/${id}`, record).pipe(
      catchError(error => {
        console.error('Error updating record:', error);
        return throwError(() => new Error('Failed to update record'));
      })
    );
  }

  storeRecord(record: any): Observable<any> {
    return this.http.post('/records', record).pipe(
      catchError(error => {
        console.error('Error storing record:', error);
        return throwError(() => new Error('Failed to store record'));
      })
    );
  }
}