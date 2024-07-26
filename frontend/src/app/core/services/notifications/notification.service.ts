import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Notification } from '../../models/notification.model';
import { LoggingService } from '../logging.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private loggingService: LoggingService
  ) { }

  indexNotifications(): Observable<any> {
    return this.http.get('/notifications', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getUnreadNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>('/notifications/unread', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  markAsRead(notificationId: number): Observable<any> {
    return this.http.patch(`/notifications/${notificationId}/mark-as-read`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  storeNotification(notification: { userId: number; title: string; message: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.post<any>('/notifications', {
      receiver_id: notification.userId,
      title: notification.title,
      message: notification.message
    }, { headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getNotificationsReceived(page: number, perPage: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>('/notifications/received', {
      params,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getNotificationsSent(page: number, perPage: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>('/notifications/sent', {
      params,
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      }),
      withCredentials: true
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  respondToNotification(id: number, response: { response: string }): Observable<Notification> {
    return this.http.patch<Notification>(`/notifications/${id}/respond`, response)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  private handleError(error: any) {
    this.loggingService.error('An error occurred', error);
    return throwError(error);
  }
}