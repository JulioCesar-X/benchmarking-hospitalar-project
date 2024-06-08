import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      console.warn('AuthGuard: User not logged in, redirecting to login page.');
      return this.router.createUrlTree(['/login']);
    }
    const role = this.authService.getRole();
    if (role !== 'admin') {
      console.warn(`AuthGuard: User role (${role}) not authorized, redirecting to home page.`);
      return this.router.createUrlTree(['/home']);
    }
    return true;
  }
}
