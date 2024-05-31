import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';


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

  private apiUrl!: string;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { this.getUrl();}

  getUrl(): void {
    if (this.isAdmin()) {
      this.apiUrl= `https://benchmarking-hospitalar-project.onrender.com/admin/users`;
    } else if (this.isCoordinator()){
      this.apiUrl = `https://benchmarking-hospitalar-project.onrender.com/coordinator/users`;
    }

  }

  getAllUsers(): Observable<any> {
    const token = this.cookieService.get('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Failed to fetch users:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: number): Observable<any> {
    const token = this.cookieService.get('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to delete user:', error);
        return throwError(() => error);
      })
    );
  }

  editUser(id: number, data: Data): Observable<any> {
    const token = this.cookieService.get('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No token found'));
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const body: { name: string, email: string, password: string, role_id: number } = { ...data
    };
    return this.http.put(`${this.apiUrl}/${id}`, { headers,body }).pipe(
      catchError(error => {
        console.error('Failed to edit user:', error);
        return throwError(() => error);
      })
    );
  }

  isAdmin(): boolean {
    return this.cookieService.get('role').toLowerCase() === 'admin';
  }
  isCoordinator(): boolean {
    return this.cookieService.get('role').toLowerCase() === 'coordenador';
  }

}
