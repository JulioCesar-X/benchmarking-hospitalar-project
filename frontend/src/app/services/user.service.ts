import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';


interface Data {
  name: string;
  email: string;
  password: string;
  role_id: number;
}


@Injectable({
  providedIn: 'root',

})

export class UserService {
  private apiUrl: string = ''; // Inicializa como string vazia

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
    private loginService: LoginService
  ) {
    this.updateApiUrl();
  }

  private updateApiUrl(): void {
    const role = this.loginService.getRole().toLowerCase();
    if (role === 'admin') {
      this.apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/admin/users';
      //this.apiUrl = 'http://localhost:8001/admin/users'; //para testar localmente
      // this.apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/admin/users';
      this.apiUrl = 'http://localhost:8001/admin/users'; //para testar localmente

    } else if (role === 'coordenador') {

      this.apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/coordinator/users';
       //this.apiUrl = 'http://localhost:8001/coordinator/users'; //para testar localmente
      // this.apiUrl = 'https://benchmarking-hospitalar-project.onrender.com/coordinator/users';
      this.apiUrl = 'http://localhost:8001/coordinator/users'; //para testar localmente
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('No token found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to fetch users:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to delete user:', error);
        return throwError(() => error);
      })
    );
  }

  editUser(id: number, data: Data): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders(), withCredentials: true }).pipe(
      catchError(error => {
        console.error('Failed to edit user:', error);
        return throwError(() => error);
      })
    );
  }
}
