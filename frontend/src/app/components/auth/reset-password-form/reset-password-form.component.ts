import { Component } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { NgForm, FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FormsModule,
    CommonModule
  ],
  templateUrl: './reset-password-form.component.html',
  styleUrl: './reset-password-form.component.scss'
})
export class ResetPasswordFormComponent {
  email!: string;
  code!: string;
  password!: string;
  passwordConfirmation!: string;

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.resetPassword(this.email, this.code, this.password, this.passwordConfirmation).subscribe({
      next: (response) => {
        console.log('Password has been successfully reset:', response);
      },
      error: (error) => {
        console.error('Failed to reset password:', error);
      }
    });
  }

}
