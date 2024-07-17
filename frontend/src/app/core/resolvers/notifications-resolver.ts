import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../services/notifications/notification.service';
import { Notification } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationsResolver implements Resolve<Notification[]> {
    constructor(private notificationService: NotificationService) { }

    resolve(): Observable<Notification[]> {
        return this.notificationService.getUnreadNotifications();
    }
}