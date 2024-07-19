import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // Fetch all users
  indexUsers(): Observable<User[]> {
    return this.http.get<User[]>('/users').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch users')))
    );
  }

  // Fetch paginated users
  getUsersPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/users/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated users')))
    );
  }

  resetPassword(userId: number): Observable<any> {
    return this.http.post(`/users/${userId}/reset-password-default`, {}).pipe(
      catchError(error => throwError(() => new Error('Failed to reset password')))
    );
  }

  // Fetch a single user by ID
  showUser(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch user')))
    );
  }

  showCurrentUser(): Observable<User> {
    return this.http.get<User>('/users/current').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch current user')))
    );
  }

  // Update a user
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`/users/${id}`, data).pipe(
      catchError(error => throwError(() => new Error('Failed to update user')))
    );
  }

  // Update a user role
  updateRoleUser(id: number, data: any): Observable<any> {
    return this.http.patch(`/users/${id}/update-role-user`, data).pipe(
      catchError(error => throwError(() => new Error('Failed to update user role')))
    );
  }

  // Create a user
  storeUser(data: any): Observable<any> {
    return this.http.post('/users', data).pipe(
      catchError(error => throwError(() => new Error('Failed to create user')))
    );
  }

  // Delete a user
  destroyUser(id: number): Observable<any> {
    return this.http.delete(`/users/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete user')))
    );
  }
}