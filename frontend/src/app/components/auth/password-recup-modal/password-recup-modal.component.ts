import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-recup-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, FeedbackComponent, LoadingSpinnerComponent, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './password-recup-modal.component.html',
  styleUrls: ['./password-recup-modal.component.scss']
})
export class PasswordRecupModalComponent {
  isError: boolean = false;
  isLoading: boolean = false;
  @Input() isVisible = false;
  @Output() closeEvent = new EventEmitter<void>();

  email: string = '';
  emailErrorMessage: string = '';
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' = 'success';

  constructor(private authService: AuthService, private router: Router) { }

  close() {
    this.isVisible = false;
    this.closeEvent.emit();
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  validateEmailOnBlur() {
    if (!this.validateEmail(this.email)) {
      this.emailErrorMessage = 'Formato de email inválido.';
    } else {
      this.emailErrorMessage = '';
    }
  }

  resetErrors() {
    this.emailErrorMessage = '';
    this.feedbackMessage = '';
  }

  submitEmail() {
    this.isLoading = true;
    this.resetErrors();

    if (!this.validateEmail(this.email)) {
      this.emailErrorMessage = 'Formato de email inválido.';
      this.isLoading = false;
      return;
    }

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        console.log('Email de recuperação enviado:', response);
        this.feedbackMessage = 'Email de recuperação enviado com sucesso!';
        this.feedbackType = 'success';
        this.isError = false;
        this.isLoading = false;
        this.email = '';
        setTimeout(() => {
          this.close();
          this.clearFeedbackAndRedirect();
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erro ao enviar email de recuperação:', error);

        if (error.error.message === 'User not found.') {
          this.emailErrorMessage = 'Email não registrado na aplicação. Contacte o coordenador responsável.';
        } else {
          this.feedbackMessage = 'Erro ao enviar email de recuperação.';
        }
        this.feedbackType = 'error';
        this.isError = true;
      }
    });
  }

  clearFeedbackAndRedirect() {
    setTimeout(() => {
      this.feedbackMessage = '';
      this.router.navigate(['/login']);
    }, 2000);
  }
}