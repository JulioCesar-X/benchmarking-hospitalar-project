import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../../../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationCommunicationService {
    private notificationsSubject = new Subject<Notification[]>();
    notifications$ = this.notificationsSubject.asObservable();

    sendNotifications(notifications: Notification[]) {
        this.notificationsSubject.next(notifications);
    }
}