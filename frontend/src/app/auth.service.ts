import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthInterceptor } from './auth.interceptor';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/';
  // private apiUrl = 'http://localhost:8001'; //para testar localmente
  // private role_response!: string;


  constructor(private http: HttpClient, private cookieService: CookieService,private router: Router) { }

  login(email: string, password: string): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login?email=${email}&password=${password}`,
      { email, password },
      { withCredentials: true }  // Inclui cookies e headers de autenticação
    ).pipe(
      map((response: any) => {
        this.cookieService.set('access_token', response.access_token, { expires: 1 / 24 });  // Define token para expirar em 1 hora
        // this.role_response = response.role;
        this.cookieService.set('role', response.role, { expires: 1 / 24 });
        return response;
      }),
      catchError(error => {
        console.error('Login failed', error);
        return of(null);
      })
    );
  }

  logout(): void {
    this.router.navigate(['']);
    const token = this.cookieService.get('access_token');
    if (token) {
      this.cookieService.delete('access_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.http.post(`${this.apiUrl}/logout`, {}, { headers, withCredentials: true }).subscribe(
        () => {
          console.log('Logout successful');
        },
        error => {
          console.error('Logout failed', error);
        }
      );
    } else {
      console.error('No token found');
    }
  }
  isLoggedIn(): boolean {
    return this.cookieService.get('access_token') ? true : false;
  }

  getRole(): string{
    return this.cookieService.get('role').toLowerCase();
  //   let role = this.role_response;
  //   if (role == null || role == undefined) {
  //     console.log('Role not found');
  //   }else{
  //     console.log('Role found:', role);
  //   }
  //   return this.role_response.toLowerCase();
  }
  // Novo método para solicitar o código de reset
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // Novo método para resetar a senha
  resetPassword(email: string, code: string, password: string, password_confirmation: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, code, password, password_confirmation });
  }
}
