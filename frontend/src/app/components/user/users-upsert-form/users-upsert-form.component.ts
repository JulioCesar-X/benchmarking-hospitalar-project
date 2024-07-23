import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
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
    private router: Router, private route: ActivatedRoute) { }

  formSubmited() {
    this.notificationMessage = '';
    this.resetErrors();
    if (!this.validateAllFields()) {
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

  validateAllFields(): boolean {
    this.validateName();
    this.validateEmail();
    this.validateNIF();
    this.validateRole();

    return !this.nameErrorMessage && !this.emailErrorMessage && !this.nifErrorMessage && !this.roleErrorMessage;
  }

  editUser() {
    this.isLoading = true;

    if (this.user.role_id === null) {
      this.setNotification('Role ID is required', 'error');
      this.isLoading = false;
      return;
    }

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

    if (this.user.role_id === null) {
      this.setNotification('Selecione uma role para o utilizador', 'error');
      this.isLoading = false;
      return;
    }

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
      for (const [key, messages] of Object.entries(validationErrors) as [string, string[]][]) {
        const translatedMessage = this.translateErrorMessage(messages[0]);
        if (key === 'email') {
          this.emailErrorMessage = translatedMessage;
        } else if (key === 'nif') {
          this.nifErrorMessage = translatedMessage;
        } else if (key === 'name') {
          this.nameErrorMessage = translatedMessage;
        } else if (key === 'role_id') {
          this.roleErrorMessage = translatedMessage;
        }
      }
    } else if (error.status === 409) {
      this.setNotification('Utilizador já existe no banco de dados', 'error');
    } else {
      this.setNotification('Ocorreu um erro, tente novamente mais tarde!', 'error');
    }
  }

  translateErrorMessage(message: string): string {
    switch (message) {
      case 'The email has already been taken.':
        return 'O email já foi registrado.';
      case 'The nif has already been taken.':
        return 'O NIF já foi registrado.';
      case 'The name field is required.':
        return 'O campo nome é obrigatório.';
      case 'The email field is required.':
        return 'O campo email é obrigatório.';
      case 'The nif field is required.':
        return 'O campo NIF é obrigatório.';
      case 'The role_id field is required.':
        return 'O campo role é obrigatório.';
      default:
        return message; // Retorna a mensagem original se não houver tradução
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

  validateName() {
    const namePattern = /^[a-zA-Z\s]*$/;
    if (!namePattern.test(this.user.name)) {
      this.nameErrorMessage = 'O nome não deve conter números.';
    } else {
      this.nameErrorMessage = '';
    }
  }

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.user.email)) {
      this.emailErrorMessage = 'Formato de email inválido.';
    } else {
      this.emailErrorMessage = '';
    }
  }

  validateNIF() {
    const nifPattern = /^\d{9}$/;
    if (!nifPattern.test(this.user.nif)) {
      this.nifErrorMessage = 'O NIF deve conter 9 números.';
    } else {
      this.nifErrorMessage = '';
    }
  }

  validateRole() {
    if (!this.user.role_id) {
      this.roleErrorMessage = 'Selecione uma role para o utilizador.';
    } else {
      this.roleErrorMessage = '';
    }
  }

  validateNameOnBlur() {
    this.validateName();
  }

  validateEmailOnBlur() {
    this.validateEmail();
  }

  validateNIFOnBlur() {
    this.validateNIF();
  }

  validateRoleOnBlur() {
    this.validateRole();
  }
}