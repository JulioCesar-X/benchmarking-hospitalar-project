// import { Injectable } from '@angular/core';
// import { HttpClient,HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { CookieService } from 'ngx-cookie-service';

// @Injectable({
//   providedIn: 'root'
// })
// export class NotificationService {

//   constructor(private http: HttpClient) { }

//   //defenir um modelo proprio para notificacoes?????
//   getNotifications(): Observable<Notification[]> {
//     return this.http.get<Notification[]>('/admin/notifications')
//     headers: new HttpHeaders({
//       'Authorization': `Bearer ${this.cookieService.get('access_token')}`{
//     }),
//     withCredentials: true
//   }).pipe(
//         catchError(this.handleError)
//       );
//   }

//   private handleError(error: any) {
//     console.error('An error occurred', error);
//     return throwError(error);
//   }
// }

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

  // getNotifications(): Observable<Notification[]> {
  //   return this.http.get<Notification[]>(`/admin/notifications`, {
  //     headers: new HttpHeaders({
  //       'Authorization': `Bearer ${this.cookieService.get('access_token')}`
  //     }),
  //     withCredentials: true
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  getNotificationsReceived(): Observable<Notification[]> {
    const userEmail = this.cookieService.get('email');
    // const params = new HttpParams().set('email', this.cookieService.get('email'));
    const userRole = this.cookieService.get('role').toLowerCase();
    const params = new HttpParams().set('email', userEmail);


    return this.http.get<Notification[]>(`/${userRole}/notifications/received`, {
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
