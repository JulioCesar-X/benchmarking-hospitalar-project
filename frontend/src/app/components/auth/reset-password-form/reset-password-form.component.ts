import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-reset-password-form',
  standalone: true,
  imports: [FormsModule, CommonModule, FeedbackComponent,     MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
 
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.authService.setResetToken(token);
    
      urlParams.delete('token');
      const newUrl = `${window.location.origin}${window.location.pathname}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  
    this.token = this.authService.getResetToken() || '';
  }

  onSubmit() {
    this.isLoading = true;
    const token = this.authService.getResetToken() || '';
    this.authService.resetPassword(this.email, token, this.password, this.passwordConfirmation).subscribe({
      next: (response) => {
        console.log('Password has been successfully reset:', response);
        this.isLoading = false;
        this.feedbackMessage = 'A senha foi redefinida com sucesso';
        this.feedbackType = 'success';
       
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Failed to reset password:', error);
        this.isError = true;
        this.errorMessage = error.error.email ? error.error.email[0] : 'Erro ao redefinir a senha. Verifique os campos e tente novamente.';
        this.feedbackMessage = this.errorMessage;
        this.feedbackType = 'error';
        this.isLoading = false;
      }
    });
  }
}