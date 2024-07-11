import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent {
  email!: string;
  token!: string;
  password!: string;
  passwordConfirmation!: string;
  isError: boolean = false;

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.resetPassword(this.email, this.token, this.password, this.passwordConfirmation).subscribe({
      next: (response) => {
        console.log('Password has been successfully reset:', response);
      },
      error: (error) => {
        console.error('Failed to reset password:', error);
        this.isError = true;
      }
    });
  }
}