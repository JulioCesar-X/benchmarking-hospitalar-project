import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IndicatorService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com';
  // private apiUrl = 'http://localhost:8001';



  constructor(private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getIndicators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/indicators`,
    { headers: this.getAuthHeaders(), withCredentials: true }
    )
      .pipe(
        catchError(error => {
          console.error('Error fetching indicators:', error); // Log the error for debugging
          return throwError(() => new Error('Failed to fetch indicators')); // Throw a custom error
        })
      );
  }
}
