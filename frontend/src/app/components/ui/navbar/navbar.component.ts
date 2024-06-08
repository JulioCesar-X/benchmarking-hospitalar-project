import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private AuthService: AuthService) { }

  isLoggedIn(): boolean {
    return this.AuthService.isLoggedIn();
  }
  getRole() {
    const role = this.AuthService.getRole();
    return role;
  }

  logout(): void {
    this.AuthService.logout();
  }

}
