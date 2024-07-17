import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { NotificationsListSectionComponent } from '../../../components/notifications/notifications-list-section/notifications-list-section.component';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Import Router
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
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private router: Router // Inject Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const notificationId = +params['id'];
      const tab = params['tab'] || 'received';
      this.selectedTab = tab;
      this.loadNotifications().then(() => {
        if (notificationId) {
          this.highlightNotification(notificationId);
        }
      });
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.router.navigate([], { queryParams: { tab: this.selectedTab }, queryParamsHandling: 'merge' });
    this.loadNotifications();
  }

  private async loadNotifications(): Promise<void> {
    this.isLoading = true;

    if (this.selectedTab === 'received') {
      const response = await this.notificationService.getNotificationsReceived(1, 10).toPromise();
      this.receivedNotifications = response.data.map((notification: any) => ({
        ...notification,
        detail: notification.message,
        expanded: false,
        type: 'received',
        sender: notification.sender,
        sender_email: notification.sender_email
      }));
    } else {
      const response = await this.notificationService.getNotificationsSent(1, 10).toPromise();
      this.sentNotifications = response.data.map((notification: any) => ({
        ...notification,
        detail: notification.message,
        expanded: false,
        type: 'sent',
        receiver: notification.receiver,
        receiver_email: notification.receiver_email
      }));
    }
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  highlightNotification(notificationId: number) {
    const notification = this.selectedTab === 'received'
      ? this.receivedNotifications.find(n => n.id === notificationId)
      : this.sentNotifications.find(n => n.id === notificationId);

    if (notification) {
      notification.highlighted = true;
      this.cdr.detectChanges();
      setTimeout(() => {
        const element = document.getElementById(`notification-${notificationId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'end' });
          setTimeout(() => {
            notification.highlighted = false;
            this.cdr.detectChanges();
          }, 5000);
        }
      }, 500);
    }
  }
}