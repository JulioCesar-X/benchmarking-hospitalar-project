import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

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
    return true;
  }
}