import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService } from '../../../services/notifications/notification.service';

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

  allNotifications: Array<any> = [
    {
      "id": 1,
      "Details": "You have a new message",
      "isRead": false
    },
    {
      "id": 2,
      "Details": "Your order has been shipped",
      "isRead": true
    },
    {
      "id": 3,
      "Details": "Reminder: Meeting at 3 PM",
      "isRead": false
    }];

  constructor(private AuthService: AuthService, private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.getNotifications();
  }

  isLoggedIn(): boolean {
    return this.AuthService.isLoggedIn();
  }

  getRole() {
    return this.AuthService.getRole();
  }

  logout(): void {
    this.AuthService.logout();
  }

  getNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data: Notification[]) => {
        this.allNotifications = data;
        this.checkUnreadNotifications();
        console.log("All notifications:", this.allNotifications);
        console.log("Nbr unread notifications:", this.unreadNotifications);
      },
      error: (error: any) => {
        console.error('There was an error!', error);
      }
    });

    //eliminar linha abaixo quando notificacoes foram buscadas correctamente da DB
    this.checkUnreadNotifications();
  }

  markNotificationAsRead(notification:any) {
    // update the boolean var "isRead" of the notification to true

    if(!notification.isRead){
      notification.isRead = true;
      this.unreadNotifications--;
    }

  }

  checkUnreadNotifications() {
    this.unreadNotifications = this.allNotifications.filter(notification => !notification.isRead).length;
  }

  toggleNotifications(){
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }
  
}
