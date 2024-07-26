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
import { LoggingService } from '../../../core/services/logging.service';

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
  nameError: string = '';
  isVisible: boolean = true;
  isError: boolean = false;

  constructor(
    private userService: UserService,
    private loggingService: LoggingService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
    this.loggingService.info('User:', this.user);
  }

  ngOnInit(): void { }

  formSubmited() {
    this.resetErrors();
    this.validateNameOnBlur();
    this.validateEmailOnBlur();
    this.validateCurrentPassword();
    if (this.newPassword) {
      this.validateNewPassword();
    }
    if (this.nameError || this.emailError || this.currentPasswordError || this.newPasswordError) {
      return;
    }
    this.updateProfile();
  }

  validateNameOnBlur() {
    const namePattern = /^[a-zA-ZÀ-ÿ\s]{1,50}$/;
    if (!namePattern.test(this.user.name)) {
      this.nameError = 'O nome deve conter apenas letras e espaços e ter no máximo 50 caracteres.';
    } else {
      this.nameError = '';
    }
  }

  validateEmailOnBlur() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.user.email)) {
      this.emailError = 'Formato de email inválido.';
    } else if (/(\.{2,}|[@._%+-]{2,})/.test(this.user.email)) {
      this.emailError = 'O email não deve conter caracteres especiais consecutivos.';
    } else if (/^[.@_%+-]|[@._%+-]$/.test(this.user.email)) {
      this.emailError = 'O email não deve começar ou terminar com caracteres especiais.';
    } else if (this.user.email.length > 50) {
      this.emailError = 'O email não pode ter mais de 50 caracteres.';
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

  updateProfile() {
    this.isLoading = true;
    const data: any = {
      name: this.user.name,
      email: this.user.email,
      current_password: this.currentPassword
    };

    if (this.newPassword) {
      data.password = this.newPassword;
    }

    this.userService.updateUser(this.user.id, data).subscribe(
      (response: any) => {
        this.loggingService.info('Profile updated:', response);
        this.setNotification('Perfil atualizado com sucesso!', 'success');
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
    event.preventDefault();
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
    this.nameError = '';
  }
}