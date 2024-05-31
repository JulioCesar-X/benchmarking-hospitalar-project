import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/login';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}?email=${email}&password=${password}`, { email, password }).pipe(
      map((response: any) => {
        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 30);
        console.log("token" + response.access_token);
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
    this.cookieService.delete('access_token');
    this.cookieService.delete('role');
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('access_token');
  }

  getRole(): string | null {
    return this.cookieService.get('role');
  }

  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
