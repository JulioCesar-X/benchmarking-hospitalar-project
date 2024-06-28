import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      console.warn('RoleGuard: User not logged in, redirecting to login page.');
      return this.router.createUrlTree(['/login']);
    }
    
    const expectedRoles = route.data['expectedRoles'] as Array<string>;
    const userRole = this.authService.getRole();
    
    if (!expectedRoles.includes(userRole)) {
      console.warn(`RoleGuard: User role (${userRole}) not authorized, redirecting to home page.`);
      return this.router.createUrlTree(['/home']);
    }
    
    return true;
  }
}
