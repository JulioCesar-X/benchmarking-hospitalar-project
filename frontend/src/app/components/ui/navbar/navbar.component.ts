// import { Component, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { AuthService } from '../../../auth.service';
// import { CommonModule } from '@angular/common';
// import { MatBadgeModule } from '@angular/material/badge';
// import { NotificationService } from '../../../services/notifications/notification.service';
// import { Notification } from '/Users/Los Pollos/Documents/GitHub/projeto-final/benchmarking-hospitalar-project/frontend/src/app/models/notification.model';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [
//     RouterLink,
//     CommonModule,
//     MatBadgeModule,
//   ],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.scss']
// })
// export class NavbarComponent implements OnInit {
//   isNotificationsOpen: boolean = false;
//   unreadNotifications: number = 0;

//   allNotifications: Array<any> = [
//     {
//       "id": 1,
//       "Details": "You have a new message",
//       "isRead": false
//     },
//     {
//       "id": 2,
//       "Details": "Your order has been shipped",
//       "isRead": true
//     },
//     {
//       "id": 3,
//       "Details": "Reminder: Meeting at 3 PM",
//       "isRead": false
//     }];

//   constructor(private AuthService: AuthService, private notificationService: NotificationService) { }

//   ngOnInit(): void {
//     this.getNotifications();
//   }

//   isLoggedIn(): boolean {
//     return this.AuthService.isLoggedIn();
//   }

//   getRole() {
//     return this.AuthService.getRole();
//   }

//   logout(): void {
//     this.AuthService.logout();
//   }

//   getNotifications() {
//     this.notificationService.getNotifications().subscribe({
//       next: (data: Notification[]) => {
//         this.allNotifications = data;
//         this.checkUnreadNotifications();
//         console.log("All notifications:", this.allNotifications);
//         console.log("Nbr unread notifications:", this.unreadNotifications);
//       },
//       error: (error: any) => {
//         console.error('There was an error!', error);
//       }
//     });

//     //eliminar linha abaixo quando notificacoes foram buscadas correctamente da DB
//     this.checkUnreadNotifications();
//   }

//   markNotificationAsRead(notification:any) {
//     // update the boolean var "isRead" of the notification to true

//     if(!notification.isRead){
//       notification.isRead = true;
//       this.unreadNotifications--;
//     }

//   }

//   checkUnreadNotifications() {
//     this.unreadNotifications = this.allNotifications.filter(notification => !notification.isRead).length;
//   }

//   toggleNotifications(){
//     this.isNotificationsOpen = !this.isNotificationsOpen;
//   }

// }


import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../../services/notifications/notification.service';
import { Notification } from '../../../models/notification.model'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    MatBadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
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

  logout(): void {
    this.authService.logout();
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
}
