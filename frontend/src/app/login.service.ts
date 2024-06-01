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

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?email=${email}&password=${password}`, { email, password }).pipe(
      map((response: any) => {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);
        this.cookieService.set('access_token', response.access_token, expirationTime);
        this.cookieService.set('role', response.role, expirationTime);
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
      this.http.post(this.logoutUrl,{}, { headers }).subscribe(
        () => {
          this.cookieService.delete('access_token');
          this.cookieService.delete('role');
          this.router.navigate(['']);
        },
        error => {
          console.error('Logout failed', error);
        }
      );
    } else {
      console.error('No token found');
      this.router.navigate(['']);
    }
  }

  getRole(): string | null {
    return this.cookieService.get('role');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('access_token');
  }
}
