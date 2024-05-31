import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from '../login.service'
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

if(loginService.isLoggedIn() && loginService.getRole() === 'admin'){
  return true;
}else{
  const urlTree = router.createUrlTree(['/Login']);
  return urlTree;
}
};
