import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Notification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  indexNotifications(): Observable<any> {
    return this.http.get('/notifications', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  getNotificationsReceived(page: number, perPage: number): Observable<any> {
    const userEmail = this.authService.getUserEmail();
    const params = new HttpParams()
      .set('email', userEmail)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>('/notifications/received', {
      params,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }
  
  getNotificationsSent(page: number, perPage: number): Observable<any> {
    const userEmail = this.authService.getUserEmail();
    const params = new HttpParams()
      .set('email', userEmail)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>('/notifications/sent', {
      params,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  respondToNotification(id: number, response: { response: string }): Observable<Notification> {
    return this.http.patch<Notification>(`/notifications/${id}/respond`, response);
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error);
  }
}