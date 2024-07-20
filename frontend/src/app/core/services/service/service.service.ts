import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from '../../models/service.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) { }

  indexServices(): Observable<Service[]> {
    return this.http.get<Service[]>('/services').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch services')))
    );
  }

  getServicesPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/services/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated services')))
    );
  }

  showService(id: number): Observable<Service> {
    return this.http.get<Service>(`/services/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch service')))
    );
  }

  storeService(service: any): Observable<any> {
    return this.http.post<any>('/services', service).pipe(
      catchError(error => throwError(() => new Error('Failed to create service')))
    );
  }

  updateService(id: number,service: any): Observable<any> {
    return this.http.put<any>(`/services/${id}`, service).pipe(
      catchError(error => throwError(() => new Error('Failed to update service')))
    );
  }

  destroyService(id: number): Observable<any> {
    return this.http.delete(`/services/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete service')))
    );
  }
}