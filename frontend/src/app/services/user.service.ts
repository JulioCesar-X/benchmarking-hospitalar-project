import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '../models/User.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //para testar para passar o user a ser editado JMS...............
  private userDataSource = new BehaviorSubject<any>(null); // Use BehaviorSubject for initial value
  userData$ = this.userDataSource.asObservable();

  setUserData(data: any) {
    this.userDataSource.next(data);
  }
  //.................................JMS

  constructor(private http: HttpClient, private authService: AuthService, private cookieService: CookieService) { }

  searchUsers(searchTerm: string, page: number = 1, pageSize: number = 10, name: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', searchTerm)
      .set('name', name);

    // Assuming 'search' is the query parameter expected by the backend

    return this.http.get<any[]>(`/admin/search?search=${name}`, { params: params, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(
      `/admin/users?page=${page}&pageSize=${pageSize}`,
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.cookieService.get('access_token')}`
        }),
        withCredentials: true
      }
    ).pipe(
      catchError(this.handleError)
    );
  }

  createUser(data: User): Observable<any> {
    return this.http.post('/admin/users', data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  editUser(id: number, data: User): Observable<any> {
    return this.http.put(`/admin/users/${id}`, data, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`,
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<void>(`/admin/users/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable < never > {
  let errorMessage = 'Unknown error occurred. Please try again.';
  if(error.error instanceof ErrorEvent) {
  console.error('Client-side error:', error.error.message);
  errorMessage = `An error occurred: ${error.error.message}`;
} else {
  console.error(`Server returned code ${error.status}, body was: ${error.error}`);
  errorMessage = `Error returned from server: ${error.error.message}`;
}
return throwError(() => new Error(errorMessage));
  }
}
