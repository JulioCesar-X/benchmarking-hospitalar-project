import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

interface Data {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

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
    } else if (role === 'coordenador') {
      this.apiUrl = 'http://localhost:8001/coordinator/users'; // para testar localmente
    }
  }

  getAllUsers(params?: { search?: string, page?: number, pageSize?: number }): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }
      if (params.page) {
        httpParams = httpParams.set('page', params.page);
      }
      if (params.pageSize) {
        httpParams = httpParams.set('pageSize', params.pageSize);
      }
    }

    return this.http.get<{ users: any[], totalUsers: number }>(this.apiUrl, { params: httpParams, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  createUser(data: Data): Observable<any> {
    return this.http.post(this.apiUrl, data, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  editUser(id: number, data: Data): Observable<any> {
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
