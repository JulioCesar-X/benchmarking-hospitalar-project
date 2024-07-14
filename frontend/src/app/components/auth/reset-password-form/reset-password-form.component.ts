import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent implements OnInit {
  email!: string;
  token!: string;
  password!: string;
  passwordConfirmation!: string;
  isLoading: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Obtém o token da URL e armazena no cookie
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.authService.setResetToken(token);
      // Remove o token da URL para não ficar visível
      urlParams.delete('token');
      const newUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.replaceState({}, document.title, newUrl);
    }
    // Obtém o token do cookie e define no input
    this.token = this.authService.getResetToken() || '';
  }

  onSubmit() {
    this.isLoading = true;
    const token = this.authService.getResetToken() || ''; // Garantir que o token é uma string
    this.authService.resetPassword(this.email, token, this.password, this.passwordConfirmation).subscribe({
      next: (response) => {
        console.log('Password has been successfully reset:', response);
        this.isLoading = false;
        // Redirecionar para a página de login após 3 segundos
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to reset password:', error);
        this.isError = true;
        this.errorMessage = error.error.email ? error.error.email[0] : 'Erro ao redefinir a senha. Verifique os campos e tente novamente.';
        this.isLoading = false;
      }
    });
  }
}