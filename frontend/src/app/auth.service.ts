import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginResponse } from './models/login-response.model';



@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com';
  //private apiUrl = 'http://localhost:8001'; //para testar localmente

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  getToken(): string | null {
    return this.cookieService.get('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(
        map(response => {
          this.cookieService.set('access_token', response.access_token, { secure: true, sameSite: 'Strict' });
          this.cookieService.set('role', response.role, { secure: true, sameSite: 'Strict' });
          return response;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed: ' + error.message));
        })
      );
  }

  logout(): void {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      this.router.navigate(['/login']);
      return;
    }
    this.http.post(`${this.apiUrl}/logout`, {}, { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }), withCredentials: true })
      .subscribe(
        () => {
          this.cookieService.delete('access_token', '/');
          this.cookieService.delete('role', '/');
          console.log('Logout successful');
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Logout failed', error);
          this.router.navigate(['/login']);
        }
      );
  }

  getRole(): string {
    return this.cookieService.get('role').toLowerCase() || 'guest';
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(email: string, code: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, code, password, password_confirmation });
  }

}
