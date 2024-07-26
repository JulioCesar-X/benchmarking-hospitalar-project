import { Component, Input, OnInit, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { TimelineItem } from '../../../core/models/timeline-item.model';

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
  @Input() notifications: TimelineItem[] = [];
  @Input() isLoading: boolean = false;
  @Input() type: 'received' | 'sent' = 'received';

  @ViewChild('timeline', { static: false }) timeline: ElementRef | undefined;

  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  loadingItemId: number | null = null;
  responseError: string = '';

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Initial load logic if necessary
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const threshold = 300;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;

    if (position > height - threshold) {
      // Implement pagination logic if necessary
    }
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

  validateResponse(response: string | undefined) {
    if (response && response.length > 200) {
      this.responseError = 'A resposta não pode ter mais de 200 caracteres.';
    } else {
      this.responseError = '';
    }
  }

  sendResponse(item: TimelineItem, event: Event) {
    event.stopPropagation();
    this.validateResponse(item.newResponse);

    if (this.responseError || !item.newResponse) return;

    this.clearFeedback();

    this.isLoading = true;
    this.loadingItemId = item.id;
    const response = {
      response: item.newResponse
    };

    this.notificationService.respondToNotification(item.id, response).subscribe({
      next: (updatedNotification) => {
        item.response = updatedNotification.response;
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