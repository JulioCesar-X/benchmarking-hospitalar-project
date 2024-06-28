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
    return this.http.get<User[]>('/admin/users').pipe(
      catchError(error => throwError(() => new Error('Failed to fetch users')))
    );
  }

  // Fetch paginated users
  getUsersPaginated(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`/admin/users/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated users')))
    );
  }

  // Create a new user
  storeUser(data: any): Observable<any> {
    return this.http.post('/admin/users', data).pipe(
      catchError(error => throwError(() => new Error('Failed to create user')))
    );
  }

  // Fetch a single user by ID
  showUser(id: number): Observable<User> {
    return this.http.get<User>(`/admin/users/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch user')))
    );
  }

  // Update a user
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`/admin/users/${id}`, data).pipe(
      catchError(error => throwError(() => new Error('Failed to update user')))
    );
  }

  // Delete a user
  destroyUser(id: number): Observable<any> {
    return this.http.delete(`/admin/users/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete user')))
    );
  }
  
}
