import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const isLoggedIn = loginService.isLoggedIn();
  const role = loginService.getRole()?.toLowerCase();

  if (!isLoggedIn) {
    // Redireciona diretamente para a página de login se não estiver logado
    return router.createUrlTree(['/login']);
  }
  // Verifica se o usuário é um administrador
  if (role === 'admin') {
    // Continua para a rota protegida
    return true;
  } else {
    // Redireciona para uma página padrão ou de erro se não for admin
    return router.createUrlTree(['/home']); // Substitua isso conforme necessário
  }
};
