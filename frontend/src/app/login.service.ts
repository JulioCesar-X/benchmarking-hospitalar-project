import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthInterceptor } from './auth.interceptor';


@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/login';
  private logoutUrl = 'https://benchmarking-hospitalar-project.onrender.com/logout';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}?email=${email}&password=${password}`,
      { email, password },
      { withCredentials: true }  // Inclui cookies e headers de autenticação
    ).pipe(
      map((response: any) => {
        this.cookieService.set('access_token', response.access_token);
        this.cookieService.set('role', response.role);
        return response;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(null);
      })
    );
  }

  logout(): void {
    const token = this.cookieService.get('access_token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(this.logoutUrl, {}, { headers, withCredentials: true }).subscribe(
        () => {
          this.cookieService.delete('access_id');
          this.cookieService.delete('role');
        },
        error => {
          console.error('Logout failed', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }
}
