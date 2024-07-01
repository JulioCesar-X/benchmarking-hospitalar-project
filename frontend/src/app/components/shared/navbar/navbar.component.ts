import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { Notification } from '../../../core/models/notification.model';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatBadgeModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isNavbarOpen: boolean = false;
  isDropdownOpen: boolean = false;
  isLoginOut: boolean = false; 
  isNotificationsOpen: boolean = false;
  unreadNotifications: number = 0;
  allNotifications: Notification[] = [];

  constructor(private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getNotifications();

    // Polling for new notifications every 30 seconds
    setInterval(() => {
      this.getNotifications();
    }, 30000);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getRole() {
    return this.authService.getRole();
  }
  getUserName(): string {
    return this.authService.getUserName();
  }

  async logout(): Promise<void> {
    alert("this ran")
    this.isLoginOut = true;
    try {
      await this.authService.logout();
    } catch (error) {
      // Handle the error if needed
      console.error('Error during logout:', error);
    } finally {
      this.isLoginOut = false;
    }
  }

  getNotifications() {
    this.notificationService.getNotificationsReceived().subscribe({
      next: (notifications: Notification[]) => {
        this.allNotifications = notifications;
        this.checkUnreadNotifications();
      },
      error: (error) => {
        console.error('Error fetching notifications', error);
      }
    });
  }

  markNotificationAsRead(notification: Notification) {
    if (!notification.isRead) {
      notification.isRead = true;
      this.unreadNotifications--;
    }
  }

  checkUnreadNotifications() {
    this.unreadNotifications = this.allNotifications.filter(notification => !notification.isRead).length;
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  openNavBar(){
    this.isNavbarOpen = !this.isNavbarOpen;
  }
  

}
