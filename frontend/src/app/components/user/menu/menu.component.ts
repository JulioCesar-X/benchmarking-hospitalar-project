import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../auth.service'

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ], // Import CommonModule here
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  isManageUsersSubMenuOpen = false;
  isManageContentSubMenuOpen = false;
  isManageNotificationsSubMenuOpen = false;

  constructor(private authService: AuthService) { }

  getRole() {
    return this.authService.getRole();
  }

  openManageUsers() {
    this.isManageUsersSubMenuOpen = !this.isManageUsersSubMenuOpen;
  }
  openManageContent() {
    this.isManageContentSubMenuOpen = !this.isManageContentSubMenuOpen;
  }

  openManageNotifications() {
    this.isManageNotificationsSubMenuOpen = !this.isManageNotificationsSubMenuOpen;
  }
}
