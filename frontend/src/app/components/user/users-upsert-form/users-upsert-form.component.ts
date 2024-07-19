import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';

@Component({
  selector: 'app-users-upsert-form',
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
    LoadingSpinnerComponent,
    MatTooltipModule
  ],
  templateUrl: './users-upsert-form.component.html',
  styleUrls: ['./users-upsert-form.component.scss']
})
export class UsersUpsertFormComponent {
  loadingCircleMessage: string = "A carregar";
  @Input() formsAction: string = '';

  @Input() user: User = {
    id: 0,
    name: '',
    email: '',
    nif: '',
    password: '',
    role_id: 0,
    roles: []
  };

  isModalVisible = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading = false;

  nameErrorMessage: string = '';
  emailErrorMessage: string = '';
  nifErrorMessage: string = '';
  roleErrorMessage: string = '';

  constructor(private userService: UserService, private authService: AuthService,
    private router: Router) { }

  formSubmited() {
    this.notificationMessage = '';
    this.resetErrors();

    if (!this.validateName(this.user.name)) {
      this.nameErrorMessage = 'Nome deve conter apenas letras.';
      return;
    }

    if (!this.validateEmail(this.user.email)) {
      this.emailErrorMessage = 'Formato de email inválido.';
      return;
    }

    if (!this.validateNIF(this.user.nif)) {
      this.nifErrorMessage = 'NIF deve conter exatamente 9 números.';
      return;
    }

    if (!this.user.role_id) {
      this.roleErrorMessage = 'Role deve ser selecionada.';
      return;
    }

    if (this.formsAction === 'create') {
      this.createUser();
      this.loadingCircleMessage = "A criar utilizador...";
    } else if (this.formsAction === 'edit') {
      this.editUser();
      this.loadingCircleMessage = "A editar utilizador...";
    }
  }

  validateName(name: string): boolean {
    const namePattern = /^[A-Za-z\s]+$/;
    return namePattern.test(name);
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  validateNIF(nif: string): boolean {
    const nifPattern = /^\d{9}$/;
    return nifPattern.test(nif);
  }

  validateNameOnBlur() {
    this.nameErrorMessage = this.validateName(this.user.name) ? '' : 'Nome deve conter apenas letras.';
  }

  validateEmailOnBlur() {
    this.emailErrorMessage = this.validateEmail(this.user.email) ? '' : 'Formato de email inválido.';
  }

  validateNIFOnBlur() {
    this.nifErrorMessage = this.validateNIF(this.user.nif) ? '' : 'NIF deve conter exatamente 9 números.';
  }

  validateRole() {
    this.roleErrorMessage = this.user.role_id ? '' : 'Role deve ser selecionada.';
  }

  editUser() {
    this.isLoading = true;

    this.userService.updateRoleUser(this.user.id, { role_id: this.user.role_id }).subscribe(
      (response: any) => {
        this.setNotification('Utilizador atualizado com sucesso!', 'success');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/users']), 2000);
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  createUser() {
    this.isLoading = true;

    this.userService.storeUser(this.user).subscribe(
      (response: any) => {
        this.setNotification('Utilizador criado com sucesso!', 'success');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/users']), 2000);
      },
      (error: any) => {
        this.handleError(error);
      }
    );
  }

  resetPassword() {
    this.isLoading = true;
    this.userService.resetPassword(this.user.id).subscribe(
      (response: any) => {
        this.setNotification('Password resetada para default com sucesso!', 'success');
        this.isLoading = false;
      },
      (error: any) => {
        this.setNotification('Erro ao resetar a password. Tente novamente mais tarde.', 'error');
        this.isLoading = false;
      }
    );
  }

  handleError(error: any) {
    this.isLoading = false;
    if (error.status === 422) {
      const validationErrors = error.error.errors;
      if (validationErrors.name) {
        this.nameErrorMessage = validationErrors.name[0];
      }
      if (validationErrors.email) {
        this.emailErrorMessage = validationErrors.email[0];
      }
      if (validationErrors.nif) {
        this.nifErrorMessage = validationErrors.nif[0];
      }
      if (validationErrors.role_id) {
        this.roleErrorMessage = validationErrors.role_id[0];
      }
    } else if (error.status === 409) {
      this.setNotification('Utilizador já existe no banco de dados', 'error');
    } else {
      this.setNotification('Ocorreu um erro, tente novamente mais tarde!', 'error');
    }
  }

  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  resetErrors() {
    this.nameErrorMessage = '';
    this.emailErrorMessage = '';
    this.nifErrorMessage = '';
    this.roleErrorMessage = '';
  }

  clearForm() {
    this.user.name = '';
    this.user.email = '';
    this.user.password = '';
    this.user.role_id = null;
  }

  getRole() {
    return this.authService.getRole();
  }
}