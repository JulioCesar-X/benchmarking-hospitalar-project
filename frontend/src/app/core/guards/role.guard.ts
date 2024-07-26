import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { LoggingService } from '../services/logging.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private loggingService: LoggingService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const expectedRoles = route.data['expectedRole'];
    const role = this.authService.getRole();
    this.loggingService.info('Role:', role);

    if (!this.authService.isLoggedIn()) {
      this.loggingService.warn('RoleGuard: User not logged in, redirecting to login page.');
      return this.router.createUrlTree(['/login']);
    }

    if (!expectedRoles.includes(role) && role !== 'root') {
      this.loggingService.warn(`RoleGuard: User role (${role}) not authorized, redirecting to home page.`);
      return this.router.createUrlTree(['/home']);
    }

    return true;
  }
}