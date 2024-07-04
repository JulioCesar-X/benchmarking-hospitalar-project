import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ], // Import CommonModule here
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isManageUsersSubMenuOpen = false;
  isManageContentSubMenuOpen = false;
  isManageNotificationsSubMenuOpen = false;
  isManageActivitiesSubMenuOpen = false;
  isManageServicesSubMenuOpen = false;
  isManageIndicatorsSubMenuOpen = false;
  isMenuOpen = false;

  constructor(private authService: AuthService) { }

  getRole() {
    return this.authService.getRole();
  }

  // openManageUsers() {
  //   this.isManageUsersSubMenuOpen = !this.isManageUsersSubMenuOpen;

  //   this.isManageContentSubMenuOpen = this.isManageContentSubMenuOpen == true ? false : false;
  //   this.isManageNotificationsSubMenuOpen = this.isManageNotificationsSubMenuOpen == true ? false : false;
  // }
  // openManageContent() {
  //   this.isManageContentSubMenuOpen = !this.isManageContentSubMenuOpen;

  //   this.isManageUsersSubMenuOpen = this.isManageUsersSubMenuOpen == true ? false : false;
  //   this.isManageNotificationsSubMenuOpen = this.isManageNotificationsSubMenuOpen == true ? false : false;
  // }

  // openManageNotifications() {
  //   this.isManageNotificationsSubMenuOpen = !this.isManageNotificationsSubMenuOpen;

  //   this.isManageUsersSubMenuOpen = this.isManageUsersSubMenuOpen == true ? false : false;
  //   this.isManageContentSubMenuOpen = this.isManageContentSubMenuOpen == true ? false : false;
  // }

  // openManageActivitiesSubMenuOpen() {
  //   this.isManageActivitiesSubMenuOpen = !this.isManageActivitiesSubMenuOpen;

  //   this.isManageActivitiesSubMenuOpen = this.isManageActivitiesSubMenuOpen == true ? false : false;
  //   this.isManageNotificationsSubMenuOpen = this.isManageNotificationsSubMenuOpen == true ? false : false;
  // }

  // openMenu(){
  //   this.isMenuOpen = !this.isMenuOpen;
  // }

  //fechar menus
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

  openMenu(){
      this.isMenuOpen = !this.isMenuOpen;
    }
  

  capitalize(str: string): string {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
