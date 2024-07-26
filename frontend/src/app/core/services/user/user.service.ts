import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private loggingService: LoggingService) { }

  indexUsers(): Observable<User[]> {
    return this.http.get<User[]>('/users').pipe(
      catchError(error => {
        this.loggingService.error('Failed to fetch users:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  getUsersPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/users/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => {
        this.loggingService.error('Failed to fetch paginated users:', error);
        return throwError(() => new Error('Failed to fetch paginated users'));
      })
    );
  }

  resetPassword(userId: number): Observable<any> {
    return this.http.post(`/users/${userId}/reset-password-default`, {}).pipe(
      catchError(error => {
        this.loggingService.error('Failed to reset password:', error);
        return throwError(() => new Error('Failed to reset password'));
      })
    );
  }

  showUser(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`).pipe(
      catchError(error => {
        this.loggingService.error('Failed to fetch user:', error);
        return throwError(() => new Error('Failed to fetch user'));
      })
    );
  }

  showCurrentUser(): Observable<User> {
    return this.http.get<User>('/users/current').pipe(
      catchError(error => {
        this.loggingService.error('Failed to fetch current user:', error);
        return throwError(() => new Error('Failed to fetch current user'));
      })
    );
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`/users/${id}`, data).pipe(
      catchError(error => {
        this.loggingService.error('Failed to update user:', error);
        return throwError(() => new Error('Failed to update user'));
      })
    );
  }

  updateRoleUser(id: number, data: any): Observable<any> {
    return this.http.patch(`/users/${id}/update-role-user`, data).pipe(
      catchError(error => {
        this.loggingService.error('Failed to update user role:', error);
        return throwError(() => new Error('Failed to update user role'));
      })
    );
  }

  storeUser(data: any): Observable<any> {
    return this.http.post('/users', data).pipe(
      catchError(error => {
        this.loggingService.error('Failed to store user:', error);
        return throwError(() => new Error('Failed to store user'));
      })
    );
  }

  destroyUser(id: number): Observable<any> {
    return this.http.delete(`/users/${id}`).pipe(
      catchError(error => {
        this.loggingService.error('Failed to delete user:', error);
        return throwError(() => new Error('Failed to delete user'));
      })
    );
  }
}