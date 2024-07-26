import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FeedbackComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
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
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' = 'success';
  errorMessage: string = '';
  hidePassword = signal(true);
  hidePasswordConfirmation = signal(true);
  emailError: string = '';
  passwordError: string = '';
  passwordConfirmationError: string = '';
  passwordFeedback: string[] = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token') || '';
    this.email = urlParams.get('email') || '';

    if (this.token && this.email) {
      this.authService.setResetToken(this.token);
      this.authService.setResetEmail(this.email);
      this.authService.verifyResetToken(this.token, this.email).subscribe({
        next: () => {
          urlParams.delete('token');
          urlParams.delete('email');
          const newUrl = `${window.location.origin}${window.location.pathname}`;
          window.history.replaceState({}, document.title, newUrl);
        },
        error: () => {
          this.feedbackMessage = 'Token inválido ou expirado. Redirecionando para a página de login...';
          this.feedbackType = 'error';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        }
      });
    } else {
      this.feedbackMessage = 'Nenhum token ou email fornecido. Redirecionando para a página de login...';
      this.feedbackType = 'error';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.resetErrors();

    if (!this.validateEmail(this.email)) {
      this.emailError = 'Formato de email inválido.';
      this.isLoading = false;
      return;
    }

    this.passwordFeedback = this.getPasswordFeedback(this.password);

    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationError = 'As senhas não coincidem.';
      this.isLoading = false;
      return;
    }

    if (this.passwordFeedback.length > 0) {
      this.passwordError = 'A senha deve atender aos critérios de segurança.';
      this.isLoading = false;
      return;
    }

    const token = this.authService.getResetToken() || '';
    const email = this.authService.getResetEmail() || '';

    this.authService.resetPassword(email, token, this.password, this.passwordConfirmation).subscribe({
      next: (response) => {
        console.log('Password has been successfully reset:', response);
        this.isLoading = false;
        this.feedbackMessage = 'A senha foi redefinida com sucesso';
        this.feedbackType = 'success';
        this.authService.removeResetToken();
        this.authService.removeResetEmail();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to reset password:', error);
        this.isError = true;
        if (error.error.email) {
          this.emailError = error.error.email[0];
        } else {
          this.errorMessage = 'Erro ao redefinir a senha. Verifique os campos e tente novamente.';
          this.feedbackMessage = this.errorMessage;
          this.feedbackType = 'error';
        }
        this.isLoading = false;
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  validateEmailOnBlur() {
    if (!this.validateEmail(this.email)) {
      this.emailError = 'Formato de email inválido.';
    } else {
      this.emailError = '';
    }
  }

  validatePasswordOnBlur() {
    this.passwordFeedback = this.getPasswordFeedback(this.password);
    if (this.passwordFeedback.length > 0) {
      this.passwordError = 'A senha deve atender aos critérios de segurança.';
    } else {
      this.passwordError = '';
    }
  }

  validatePasswordConfirmationOnBlur() {
    if (this.password !== this.passwordConfirmation) {
      this.passwordConfirmationError = 'As senhas não coincidem.';
    } else {
      this.passwordConfirmationError = '';
    }
  }

  getPasswordFeedback(password: string): string[] {
    const feedback: string[] = [];
    if (!/(?=.*[a-z])/.test(password)) {
      feedback.push('Deve conter pelo menos uma letra minúscula.');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      feedback.push('Deve conter pelo menos uma letra maiúscula.');
    }
    if (!/(?=.*\d)/.test(password)) {
      feedback.push('Deve conter pelo menos um número.');
    }
    if (!/(?=.*[@$!%*?&#])/.test(password)) {
      feedback.push('Deve conter pelo menos um caractere especial.');
    }
    if (!/.{10,}/.test(password)) {
      feedback.push('Deve conter pelo menos 10 caracteres.');
    }
    return feedback;
  }

  clickEventPassword(event: MouseEvent) {
    event.preventDefault(); // Prevent default form submission
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  clickEventPasswordConfirmation(event: MouseEvent) {
    event.preventDefault(); // Prevent default form submission
    this.hidePasswordConfirmation.set(!this.hidePasswordConfirmation());
    event.stopPropagation();
  }

  resetErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.passwordConfirmationError = '';
  }

  preventCopyPaste(event: ClipboardEvent) {
    event.preventDefault();
  }
}