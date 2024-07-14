import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse } from '../../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  getToken(): string | null {
    return this.cookieService.get('access_token');
  }

  getUserName(): string {
    return this.cookieService.get('name');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>('/login', { email, password }, { withCredentials: true })
      .pipe(
        map(response => {
          this.cookieService.set('access_token', response.access_token, { secure: true, sameSite: 'Strict' });
          this.cookieService.set('email', response.email, { secure: true, sameSite: 'Strict' });
          this.cookieService.set('role', response.role, { secure: true, sameSite: 'Strict' });
          this.cookieService.set('name', response.name, { secure: true, sameSite: 'Strict' });
          return response;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed: ' + error.message));
        })
      );
  }

  register(data: any): Observable<any> {
    return this.http.post('/register', data).pipe(
      catchError(error => throwError(() => new Error('Failed to create user')))
    );
  }

  logout(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const token = this.getToken();
      if (!token) {
        console.error('No token found');
        this.router.navigate(['/login']);
        reject('No token found');
        return;
      }

      this.http.post('/logout', {}, { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }), withCredentials: true })
        .subscribe(
          () => {
            this.cookieService.delete('access_token', '/');
            this.cookieService.delete('role', '/');
            this.cookieService.delete('name', '/');
            this.cookieService.delete('email', '/');
            console.log('Logout successful');
            this.router.navigate(['/login']);
            resolve(true);
          },
          error => {
            console.error('Logout failed', error);
            reject(error);
          }
        );
    });
  }

  getRole(): string {
    return this.cookieService.get('role').toLowerCase() || 'guest';
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post('/forgot-password', { email });
  }

  resetPassword(email: string, token: string, password: string, passwordConfirmation: string): Observable<any> {
    return this.http.post('/reset-password', { email, token, password, password_confirmation: passwordConfirmation });
  }

  setResetToken(token: string): void {
    this.cookieService.set('password_reset_token', token, { secure: true, sameSite: 'Strict' });
  }

  getResetToken(): string {
    return this.cookieService.get('password_reset_token');
  }
}