import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model'; // Import the Service interface
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/services';

  constructor(private http: HttpClient) { }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl);
  }
  getServiceById(serviceId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${serviceId}`).pipe(
      catchError(error => {
        console.error('Error fetching service by ID:', error);
        throw error;
      })
    );
  }
}
