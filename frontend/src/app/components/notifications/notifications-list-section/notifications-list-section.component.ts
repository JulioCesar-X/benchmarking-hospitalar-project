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
import { Notification } from '../../../core/models/notification.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../../core/services/notifications/notification.service';

interface TimelineItem {
  id: number;
  title: string;
  detail: string;
  expanded: boolean;
  notification: Notification;
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
    MatFormFieldModule
  ],
  templateUrl: './notifications-list-section.component.html',
  styleUrls: ['./notifications-list-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsListSectionComponent implements OnInit {
  @ViewChild('timeline', { static: false }) timeline: ElementRef | undefined;

  notifications: Notification[] = [];
  timelineItems: TimelineItem[] = [];

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.notificationService.getNotificationsReceived().subscribe(notifications => {
      this.notifications = notifications;
      this.timelineItems = notifications.map(notification => ({
        id: notification.id,
        title: notification.created_at,
        detail: notification.message,
        expanded: false,
        notification: notification
      }));
      this.checkElementsInView(); // Chamar ao inicializar
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.checkElementsInView();
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
  }

  isElementInView(item: TimelineItem): boolean {
    const elements = document.querySelectorAll('.timeline ul li .timeline-item');
    let elementInView = false;

    elements.forEach((element) => {
      if (element.textContent?.includes(item.title)) {
        const bounding = element.getBoundingClientRect();
        if (
          bounding.top >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        ) {
          elementInView = true;
        }
      }
    });

    return elementInView;
  }
}