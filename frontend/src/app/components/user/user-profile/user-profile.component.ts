import { Component, Input, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeedbackComponent,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() user: User;
  @Input() formsAction: string = 'Atualizar';
  isLoading: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  hideCurrentPassword: boolean = true;
  hideNewPassword: boolean = true;
  currentPassword: string = '';
  newPassword: string = '';
  currentPasswordError: string = '';
  newPasswordError: string = '';
  newPasswordFeedback: string[] = [];
  emailError: string = '';
  isVisible: boolean = true;
  isError: boolean = false;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    console.log('User:', this.user);
  }

  ngOnInit(): void { }

  formSubmited() {
    this.resetErrors();
    this.validateEmailOnBlur();
    this.validateCurrentPassword();
    this.validateNewPassword();
    if (this.emailError || this.currentPasswordError || this.newPasswordError) {
      return;
    }
    this.updatePassword();
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  validateEmailOnBlur() {
    if (!this.validateEmail(this.user.email)) {
      this.emailError = 'Formato de email inválido.';
    } else {
      this.emailError = '';
    }
  }

  validateCurrentPassword() {
    if (!this.currentPassword) {
      this.currentPasswordError = 'A senha atual é necessária.';
    } else {
      this.currentPasswordError = '';
    }
  }

  validateNewPassword() {
    this.newPasswordFeedback = this.getPasswordFeedback(this.newPassword);
    if (this.newPasswordFeedback.length > 0) {
      this.newPasswordError = 'A nova senha deve atender aos critérios de segurança.';
    } else {
      this.newPasswordError = '';
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

  updatePassword() {
    this.isLoading = true;
    console.log('Updating password for user:', this.user);
    const data = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.userService.updateUserPassword(data).subscribe(
      (response: any) => {
        console.log('Password updated:', response);
        this.setNotification('Senha atualizada com sucesso!', 'success');
        this.isLoading = false;
        setTimeout(() => this.dialogRef.close(), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        if (error.status === 400) {
          this.currentPasswordError = 'Senha atual está incorreta.';
        }
        this.setNotification(errorMessage, 'error');
        this.isLoading = false;
      }
    );
  }

  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Utilizador já existe no banco de dados';
    }
    if (error.status === 400) {
      return 'Email invalido ou password incorreta';
    }
    return 'Ocorreu um erro, tente novamente mais tarde!';
  }

  togglePasswordVisibility(type: 'current' | 'new', event: MouseEvent) {
    event.preventDefault(); // Prevent default form submission
    if (type === 'current') {
      this.hideCurrentPassword = !this.hideCurrentPassword;
    } else {
      this.hideNewPassword = !this.hideNewPassword;
    }
    event.stopPropagation();
  }

  close() {
    this.dialogRef.close();
  }

  preventCopyPaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  resetErrors() {
    this.emailError = '';
    this.currentPasswordError = '';
    this.newPasswordError = '';
  }
}