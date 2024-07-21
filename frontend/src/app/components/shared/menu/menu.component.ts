import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ServiceService } from '../../../core/services/service/service.service';
import { FeedbackComponent } from '../feedback/feedback.component'; // Import FeedbackComponent

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    FeedbackComponent // Declare FeedbackComponent
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent {
  isManageUsersSubMenuOpen = false;
  isManageContentSubMenuOpen = false;
  isManageNotificationsSubMenuOpen = false;
  isManageActivitiesSubMenuOpen = false;
  isManageServicesSubMenuOpen = false;
  isManageIndicatorsSubMenuOpen = false;
  isMenuOpen = true;
  loadingCharts = false; // State for loading charts
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  constructor(private authService: AuthService, private router: Router, private serviceService: ServiceService) { }

  getRole() {
    return this.authService.getRole();
  }

  openManageUsers() {
    this.isManageUsersSubMenuOpen = !this.isManageUsersSubMenuOpen;
    this.closeOtherSubMenus('users');
  }

  openManageServices() {
    this.isManageServicesSubMenuOpen = !this.isManageServicesSubMenuOpen;
    this.closeOtherSubMenus('services');
  }

  openManageActivities() {
    this.isManageActivitiesSubMenuOpen = !this.isManageActivitiesSubMenuOpen;
    this.closeOtherSubMenus('activities');
  }

  openManageIndicators() {
    this.isManageIndicatorsSubMenuOpen = !this.isManageIndicatorsSubMenuOpen;
    this.closeOtherSubMenus('indicators');
  }

  openManageNotifications() {
    this.isManageNotificationsSubMenuOpen = !this.isManageNotificationsSubMenuOpen;
    this.closeOtherSubMenus('notifications');
  }

  closeOtherSubMenus(except: string) {
    if (except !== 'users') this.isManageUsersSubMenuOpen = false;
    if (except !== 'services') this.isManageServicesSubMenuOpen = false;
    if (except !== 'activities') this.isManageActivitiesSubMenuOpen = false;
    if (except !== 'indicators') this.isManageIndicatorsSubMenuOpen = false;
    if (except !== 'notifications') this.isManageNotificationsSubMenuOpen = false;
  }

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  capitalize(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  goToCharts() {
    this.loadingCharts = true; // Start loading
    this.serviceService.getFirstValidService().subscribe({
      next: (service) => {
        if (service) {
          // Navigate to charts with resolver
          this.router.navigate(['/charts', { serviceId: service.id }], {
            state: { preLoad: true }
          });
        } else {
          this.feedbackMessage = 'Nenhum serviço válido encontrado';
          this.feedbackType = 'error';
        }
        this.loadingCharts = false; // Stop loading
      },
      error: (error) => {
        this.feedbackMessage = error.message;
        this.feedbackType = 'error';
        this.loadingCharts = false; // Stop loading
      }
    });
  }
}