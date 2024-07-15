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
    console.log("pagination", pageIndex, pageSize);

    return this.http.get<any>(`/users/paginated?page=${pageIndex}&size=${pageSize}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch paginated users')))
    );
  }
  
  resetPassword(userId: number): Observable<any> {
    return this.http.post(`/users/${userId}/reset-password-default`, {});
  }

  // Fetch a single user by ID
  showUser(id: number): Observable<User> {
    return this.http.get<User>(`/users/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to fetch user')))
    );
  }

  // Update a user
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`/users/${id}`, data).pipe(
      catchError(error => throwError(() => new Error('Failed to update user')))
    );
  }

  // Delete a user
  destroyUser(id: number): Observable<any> {
    return this.http.delete(`/users/${id}`).pipe(
      catchError(error => throwError(() => new Error('Failed to delete user')))
    );
  }
  
}
