import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../models/service.model';  // Certifique-se de que a interface Service esteja corretamente definida
import { BehaviorSubject, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  //Passar dados da lista para pagina de edit
  private serviceDataSource = new BehaviorSubject<any>(null); // Use BehaviorSubject for initial value
  serviceData$ = this.serviceDataSource.asObservable();

  setServiceData(data: any) {
    this.serviceDataSource.next(data);
  }
  //........JMS

  constructor(private http: HttpClient, private cookieService:CookieService) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>('/services', { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getServiceById(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`/services/${serviceId}`, { withCredentials: true })
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

  createService(data: any): Observable<any> {
    return this.http.post('/admin/services', data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  editService(id: number, data: any): Observable<any> {
    return this.http.put(`/admin/services/${id}`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`,
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }
}
