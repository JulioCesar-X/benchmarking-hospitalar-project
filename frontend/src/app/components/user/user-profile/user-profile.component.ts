import { Component, Input, Inject, signal } from '@angular/core';
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
export class UserProfileComponent {
  @Input() user: User;
  @Input() formsAction: string = 'Atualizar';
  isLoading: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  hide = signal(true);
  passwordFeedback: string[] = [];
  isVisible: boolean = true;
  isError: boolean = false;

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<UserProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = data.user;
  }

  formSubmited() {
    this.notificationMessage = '';
    this.passwordFeedback = this.getPasswordFeedback(this.user.password);
    if (this.passwordFeedback.length > 0) {
      this.setNotification('A senha deve atender aos seguintes critérios:', 'error');
      return;
    }
    this.editUser();
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

  editUser() {
    this.isLoading = true;
    console.log('User:', this.user);
    if (this.user.role_id === null) {
      this.setNotification('Role ID is required', 'error');
      this.isLoading = false;
      return;
    }

    this.userService.updateUser(this.user.id, this.user).subscribe(
      (response: any) => {
        console.log('User updated:', response);
        this.setNotification('Dados atualizados com sucesso!', 'success');
        this.isLoading = false;
        setTimeout(() => this.dialogRef.close(), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
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
      return 'User already exists';
    }
    if (error.status === 400) {
      return 'Invalid email';
    }
    return 'Ocorreu um erro, tente novamente mais tarde!';
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  close() {
    this.dialogRef.close();
  }
}