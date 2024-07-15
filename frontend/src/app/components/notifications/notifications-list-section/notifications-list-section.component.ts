import { Component, OnInit, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notification } from '../../../core/models/notification.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';

interface TimelineItem {
  id: number;
  title: string;
  detail: string;
  expanded: boolean;
  notification: Notification;
  newResponse?: string;
}

@Component({
  selector: 'app-notifications-list-section',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FormsModule,
    FeedbackComponent
  ],
  templateUrl: './notifications-list-section.component.html',
  styleUrls: ['./notifications-list-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsListSectionComponent implements OnInit {
  @ViewChild('timeline', { static: false }) timeline: ElementRef | undefined;

  notifications: Notification[] = [];
  timelineItems: TimelineItem[] = [];
  currentPage = 1;
  lastPage = 1;
  perPage = 10;
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

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const threshold = 300;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (position > height - threshold && this.currentPage < this.lastPage) {
      this.currentPage++;
      this.loadNotifications();
    }
  }

  private loadNotifications() {
    this.notificationService.getNotificationsReceived(this.currentPage, this.perPage).subscribe(response => {
      this.notifications = this.notifications.concat(response.data);
      this.timelineItems = this.notifications.map(notification => ({
        id: notification.id,
        title: notification.created_at,
        detail: notification.message,
        expanded: false,
        notification: notification
      }));
      console.log(this.timelineItems);
      this.lastPage = response.last_page;
      this.cdr.detectChanges();
      this.checkElementsInView();
    });
  }

  private checkElementsInView() {
    if (!this.timeline) return;

    const timelineItems = this.timeline.nativeElement.querySelectorAll('.timeline ul li');
    timelineItems.forEach((item: HTMLElement) => {
      const bounding = item.getBoundingClientRect();
      if (
        bounding.top >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      ) {
        item.classList.add('in-view');
      } else {
        item.classList.remove('in-view');
      }
    });
  }

  toggleExpand(item: TimelineItem) {
    item.expanded = !item.expanded;
    this.cdr.detectChanges();
    const liElement = document.getElementById(`notification-${item.id}`);
    if (liElement) {
      if (item.expanded) {
        liElement.classList.add('expanded');
      } else {
        liElement.classList.remove('expanded');
      }
    }
  }

  isElementInView(item: TimelineItem): boolean {
    const element = document.getElementById(`notification-${item.id}`);
    if (element) {
      const bounding = element.getBoundingClientRect();
      return bounding.top >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }
    return false;
  }

  sendResponse(item: TimelineItem, event: Event) {
    event.stopPropagation();
    if (!item.newResponse) return;

    this.clearFeedback();

    this.isLoading = true;
    this.loadingItemId = item.id;
    const response = {
      response: item.newResponse
    };

    this.notificationService.respondToNotification(item.id, response).subscribe({
      next: (updatedNotification) => {
        item.notification = updatedNotification;
        item.newResponse = '';
        this.feedbackMessage = 'Resposta enviada com sucesso!';
        this.feedbackType = 'success';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.feedbackMessage = 'Erro ao enviar resposta. Tente novamente.';
        this.feedbackType = 'error';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loadingItemId = null;
        this.cdr.detectChanges();
      }
    });
  }

  clearFeedback() {
    this.feedbackMessage = '';
    this.feedbackType = 'success';
  }
}