import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  const role = authService.getRole()?.toLowerCase();

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
