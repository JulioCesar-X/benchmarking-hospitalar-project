import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { NotificationsListSectionComponent } from '../../../components/notifications/notifications-list-section/notifications-list-section.component';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { CommonModule } from '@angular/common';
import { TimelineItem } from '../../../core/models/timeline-item.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    NotificationsListSectionComponent,
    MenuComponent,
    CommonModule
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  selectedTab: string = 'received';
  receivedNotifications: TimelineItem[] = [];
  sentNotifications: TimelineItem[] = [];
  isLoading = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  loadingItemId: number | null = null;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadNotifications();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.isLoading = true;

    if (this.selectedTab === 'received') {
      this.notificationService.getNotificationsReceived(1, 10).subscribe(response => {
        this.receivedNotifications = response.data.map((notification: any) => ({
          ...notification,
          detail: notification.message,
          expanded: false,
          type: 'received',
          sender: notification.sender,
          sender_email: notification.sender_email
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    } else {
      this.notificationService.getNotificationsSent(1, 10).subscribe(response => {
        this.sentNotifications = response.data.map((notification: any) => ({
          ...notification,
          detail: notification.message,
          expanded: false,
          type: 'sent',
          receiver: notification.receiver,
          receiver_email: notification.receiver_email
        }));
        this.isLoading = false;
        this.cdr.detectChanges();
      });
    }
  }
}