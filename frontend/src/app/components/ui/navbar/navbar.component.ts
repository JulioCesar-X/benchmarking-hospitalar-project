import { Component } from '@angular/core';
import { RouterLink} from '@angular/router';
import { LoginService } from '../../../login.service';
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
  constructor(private loginService: LoginService) {}

  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }
  getRole(){
    const role = this.loginService.getRole();
/*     console.log(`Role do user: ${role}`) */
    return role;
  }

  logout(): void {
    this.loginService.logout();
  }

}
