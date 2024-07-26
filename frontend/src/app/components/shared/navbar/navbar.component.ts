import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { NotificationCommunicationService } from '../../../core/services/notifications/notification-communication/notification-communication.service';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatBadgeModule,
    MatMenuModule,
    MatIconModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isNavbarOpen = false;
  isDropdownOpen = false;
  isLoginOut = false;
  isNotificationsOpen = false;
  unreadNotifications = 0;
  allNotifications: Notification[] = [];
  currentUser: User | null = null;
  hasNewNotifications = false;

  private communicationSubscription: Subscription | undefined;
  private notificationSubscription: Subscription | undefined;
  private loginSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private userService: UserService,
    private router: Router,
    private notificationCommunicationService: NotificationCommunicationService,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    if (this.isLoggedIn()) {
      this.communicationSubscription = this.notificationCommunicationService.notifications$.subscribe(
        (notifications: Notification[]) => {
          this.allNotifications = notifications;
          this.checkUnreadNotifications();
        }
      );
      this.startNotificationPolling();
    }

    this.loginSubscription = this.authService.loginEvent$.subscribe((firstLogin: boolean) => {
      this.getNotifications();
      if (firstLogin) {
        this.openProfile();
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
    this.communicationSubscription?.unsubscribe();
    this.loginSubscription?.unsubscribe();
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

  logout() {
    this.isLoginOut = true;
    try {
      this.authService.logout();
      this.notificationSubscription?.unsubscribe();
      this.clearNotifications();
    } catch (error) {
      this.loggingService.error('Error during logout:', error);
    } finally {
      this.isLoginOut = false;
    }
  }

  getNotifications() {
    if (this.isLoggedIn()) {
      this.notificationService.getUnreadNotifications().subscribe({
        next: (notifications: Notification[]) => {
          this.allNotifications = notifications;
          this.checkUnreadNotifications();
        },
        error: (error) => {
          this.loggingService.error('Error fetching notifications', error);
        }
      });
    }
  }

  markNotificationAsRead(notification: Notification) {
    if (!notification.is_read) {
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          this.allNotifications = this.allNotifications.filter(n => n.id !== notification.id);
          this.unreadNotifications--;
          this.checkUnreadNotifications();

          const tab = notification.response ? 'sent' : 'received';
          this.navigateToNotification(notification.id, tab);
        },
        error: (error) => {
          this.loggingService.error('Error marking notification as read', error);
        }
      });
    }
  }

  checkUnreadNotifications() {
    const previousCount = this.unreadNotifications;
    this.unreadNotifications = this.allNotifications.length;
    this.hasNewNotifications = this.unreadNotifications > 0;
    if (this.unreadNotifications > previousCount) {
      setTimeout(() => (this.hasNewNotifications = false), 3000);
    }
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
    this.userService.showCurrentUser().subscribe(user => {
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

  startNotificationPolling() {
    if (this.isLoggedIn()) {
      this.notificationSubscription = interval(10000).subscribe(() => this.getNotifications());
    }
  }

  clearNotifications() {
    this.unreadNotifications = 0;
    this.allNotifications = [];
    this.hasNewNotifications = false;
  }

  navigateToNotification(notificationId: number, tab: string) {
    this.router.navigate(['/notifications'], { queryParams: { id: notificationId, tab: tab } });
  }

  openNotifications() {
    this.router.navigate(['/notifications']);
  }
}