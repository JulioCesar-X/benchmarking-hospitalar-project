import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ServiceService } from '../../../core/services/service/service.service';
import { FeedbackComponent } from '../feedback/feedback.component'; // Import FeedbackComponent
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    FeedbackComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuComponent implements OnInit {
  @Input() isManageUsersSubMenuOpen = false;
  @Input() isManageDataSubMenuOpen = false;
  @Input() isManageNotificationsSubMenuOpen = false;
  @Input() isManageActivitiesSubMenuOpen = false;
  @Input() isManageServicesSubMenuOpen = false;
  @Input() isManageIndicatorsSubMenuOpen = false;
  @Input() isMenuOpen = true;
  @Input() isLoadingCharts = false;

  loading = false;  // Adicionando a propriedade loading
  loadingCharts = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  constructor(private authService: AuthService, private router: Router, private serviceService: ServiceService) { }

  ngOnInit() {
    this.isLoadingCharts = false;
  }

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
  openManageData() {
    this.isManageDataSubMenuOpen = !this.isManageDataSubMenuOpen;
    this.closeOtherSubMenus('data');
  }

  closeOtherSubMenus(except: string) {
    if (except !== 'users') this.isManageUsersSubMenuOpen = false;
    if (except !== 'services') this.isManageServicesSubMenuOpen = false;
    if (except !== 'activities') this.isManageActivitiesSubMenuOpen = false;
    if (except !== 'data') this.isManageDataSubMenuOpen = false;
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

  goToRecordsGoalsUpdate() {
    this.loading = true;
    this.serviceService.getFirstValidService().subscribe({
      next: (service) => {
        if (service) {
          this.router.navigate(['/record-goals-update', { serviceId: service.id }], {
            state: { preLoad: true }
          });
        } else {
          this.feedbackMessage = 'Nenhum serviço válido encontrado';
          this.feedbackType = 'error';
        }
        this.loading = false;
      },
      error: (error) => {
        this.feedbackMessage = error.message;
        this.feedbackType = 'error';
        this.loading = false;
      }
    });
  }

  goToCharts() {
    this.loadingCharts = true;
    this.serviceService.getFirstValidService().subscribe({
      next: (service) => {
        if (service) {
          this.loadingCharts = true;
          this.router.navigate(['/charts', { serviceId: service.id }], {
            state: { preLoad: true }
          });
        } else {
          this.feedbackMessage = 'Nenhum serviço válido encontrado';
          this.feedbackType = 'error';
          this.loadingCharts = false; // Stop loading
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