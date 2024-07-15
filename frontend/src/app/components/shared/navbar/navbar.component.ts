import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../../core/services/notifications/notification.service';
import { Notification } from '../../../core/models/notification.model';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { UserProfileComponent } from '../../user/user-profile/user-profile.component';

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
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getNotifications();
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
    this.isLoginOut = true;
    try {
      await this.authService.logout();
    } catch (error) {
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

  openNavBar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  openProfile() {
    this.userService.showUser(Number(this.authService.getUserId())).subscribe(user => {
      if (user) {
        const dialogRef = this.dialog.open(UserProfileComponent, {
          width: '500px',
          data: { user: user }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Lógica após fechar o diálogo, se necessário
          }
        });
      }
    });
  }

  reply() {
    alert("Here should be the logic to answer");
  }
}