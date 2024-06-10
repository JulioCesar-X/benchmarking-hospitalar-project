import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.updateApiUrl();
  }

  private updateApiUrl(): void {
    const role = this.authService.getRole().toLowerCase();
    if (role === 'admin') {
      this.apiUrl = 'http://localhost:8001/admin/users'; // para testar localmente
      // this.apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/admin/users'; // para testar na nuvem
    } else if (role === 'coordenador') {
      this.apiUrl = 'http://localhost:8001/coordinator/users'; // para testar localmente
      // this.apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/coordinator/users'; // para testar na nuvem
    }
  }

  searchUsers(searchTerm: string, page: number = 1, pageSize: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', searchTerm);  // Assuming 'search' is the query parameter expected by the backend

    return this.http.get(`${this.apiUrl}/search`, { params: params, withCredentials: true })
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  createUser(data: User): Observable<any> {
    return this.http.post(this.apiUrl, data, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  editUser(id: number, data: User): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred. Please try again.';
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
      errorMessage = `An error occurred: ${error.error.message}`;
    } else {
      console.error(`Server returned code ${error.status}, body was: ${error.error}`);
      errorMessage = `Error returned from server: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
