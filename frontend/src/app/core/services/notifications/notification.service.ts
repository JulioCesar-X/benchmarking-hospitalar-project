import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getNotificationsReceived(): Observable<Notification[]> {
    const userRole = this.cookieService.get('role').toLowerCase();
    const userEmail = this.cookieService.get('email');
    const params = new HttpParams().set('email', userEmail);

    return this.http.get<Notification[]>(`/notifications/received`, {
      params,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cookieService.get('access_token')}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error);
  }
}
