import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const expectedRoles = route.data['expectedRole']; // Acessar a propriedade usando a sintaxe correta
    const role = this.authService.getRole();
    console.log('Role:', role);

    if (!this.authService.isLoggedIn()) {
      console.warn('RoleGuard: User not logged in, redirecting to login page.');
      return this.router.createUrlTree(['/login']);
    }

    if (!expectedRoles.includes(role) && role !== 'root') {
      console.warn(`RoleGuard: User role (${role}) not authorized, redirecting to home page.`);
      return this.router.createUrlTree(['/home']);
    }

    return true;
  }
}