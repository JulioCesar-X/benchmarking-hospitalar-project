import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

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

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>('https://benchmarking-hospitalar-project.onrender.com/activities', 
    { headers: this.getAuthHeaders(), withCredentials: true }
    )
      .pipe(
        catchError(error => {
          console.error('Error fetching activities:', error); // Log the error for debugging
          return throwError(() => new Error('Failed to fetch activities')); // Throw a custom error
        })
      );
  }


}
