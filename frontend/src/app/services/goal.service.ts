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
 export class GoalService {
    constructor(private http: HttpClient, private cookieService:CookieService) { }

    getRecords(): Observable<any[]> {
      return this.http.get<any[]>('/goals', { withCredentials: true })
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


/*    postGoal(goalData: any): Observable<any> {
     return this.http.post(`${this.apiUrl}/admin/goals`, goalData);
   } */
 }
