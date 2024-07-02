import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

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
  isMenuOpen = false;

  constructor(private authService: AuthService) { }

  getRole() {
    return this.authService.getRole();
  }

  openManageUsers() {
    this.isManageUsersSubMenuOpen = !this.isManageUsersSubMenuOpen;

    this.isManageContentSubMenuOpen = this.isManageContentSubMenuOpen == true ? false : false;
    this.isManageNotificationsSubMenuOpen = this.isManageNotificationsSubMenuOpen == true ? false : false;
  }
  openManageContent() {
    this.isManageContentSubMenuOpen = !this.isManageContentSubMenuOpen;

    this.isManageUsersSubMenuOpen = this.isManageUsersSubMenuOpen == true ? false : false;
    this.isManageNotificationsSubMenuOpen = this.isManageNotificationsSubMenuOpen == true ? false : false;
  }

  openManageNotifications() {
    this.isManageNotificationsSubMenuOpen = !this.isManageNotificationsSubMenuOpen;

    this.isManageUsersSubMenuOpen = this.isManageUsersSubMenuOpen == true ? false : false;
    this.isManageContentSubMenuOpen = this.isManageContentSubMenuOpen == true ? false : false;
  }

  openMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }
}
