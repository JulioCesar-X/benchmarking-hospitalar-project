import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgForm, FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EventEmitter, Output } from '@angular/core';
import { PasswordRecupModalComponent } from '../../../components/auth/password-recup-modal/password-recup-modal.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    PasswordRecupModalComponent,
    LoadingSpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  isModalVisible = false;

  email: string = '';
  password: string = '';
  isLoading = false;
  emailErrorMessage: string = '';
  passwordErrorMessage: string = '';
  hidePassword = signal(true);

  constructor(private authService: AuthService, private router: Router) { }

  @Output() loginEvent = new EventEmitter<{ email: string, password: string }>();

  onLogin() {
    this.isLoading = true;
    this.resetErrors();

    if (!this.validateEmail(this.email)) {
      this.emailErrorMessage = 'Formato de email inválido.';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        this.isLoading = false;
        if (response) {
          console.log('Login successful:', response);
          this.emailErrorMessage = '';
          this.router.navigate(['/home']);
        } else {
          this.passwordErrorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
        }
      },
      error => {
        console.error('Login failed', error);
        this.passwordErrorMessage = 'Erro ao tentar login. Por favor, tente novamente.';
        this.isLoading = false;
      }
    );
  }

  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  resetErrors() {
    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
  }

  validateEmailOnBlur() {
    if (!this.validateEmail(this.email)) {
      this.emailErrorMessage = 'Formato de email inválido.';
    } else {
      this.emailErrorMessage = '';
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
    event.preventDefault();
  }
}