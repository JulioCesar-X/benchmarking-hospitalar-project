import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() isManageUsersSubMenuOpen = false;
  @Input() isManageDataSubMenuOpen = false;
  @Input() isManageNotificationsSubMenuOpen = false;
  @Input() isManageActivitiesSubMenuOpen = false;
  @Input() isManageServicesSubMenuOpen = false;
  @Input() isManageIndicatorsSubMenuOpen = false;
  @Input() isMenuOpen = true;
  @Input() isLoadingCharts= false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(){
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
  openManageData(){
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

  openMenu(){
      this.isMenuOpen = !this.isMenuOpen;
    }
  

  capitalize(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  goToCharts(serviceId: number) {
    const currentUrl = this.router.url;
    const targetUrl = `/charts;serviceId=${serviceId}`;

    if (currentUrl !== targetUrl) {
      this.isLoadingCharts = true;
    }

    this.router.navigate(['/charts', { serviceId }]);
  }



}
