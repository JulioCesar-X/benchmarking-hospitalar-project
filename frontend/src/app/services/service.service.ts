import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../models/service.model';  // Certifique-se de que a interface Service esteja corretamente definida

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  // private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/services';  // URL base para serviços
  private apiUrl = 'http://localhost:8001/services';  // URL base para serviços

  constructor(private http: HttpClient) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getServiceById(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${serviceId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred. Please try again.';
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      console.error(`Server returned code ${error.status}, body was: ${error.error}`);
      errorMessage = `Error returned from server: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
