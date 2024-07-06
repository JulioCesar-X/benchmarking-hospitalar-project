import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateFieldModalComponent } from '../../shared/create-field-modal/create-field-modal.component';
import { UserService } from '../../../core/services/user/user.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-users-upsert-form',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,
    CreateFieldModalComponent,
    FeedbackComponent,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
  MatSelectModule],
  templateUrl: './users-upsert-form.component.html',
  styleUrl: './users-upsert-form.component.scss'
})
export class UsersUpsertFormComponent {
  @Input() formsAction: string = '';
  @Input() userId: string = '';

  isModalVisible = false;
  name: string = '';
  email: string = '';
  password: string = '';
  role_id: number | null = null;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  isLoading = false;

  constructor(private userService: UserService, private authService: AuthService) { }

  openModal(event: Event) {
      event.preventDefault();
      this.isModalVisible = true;
  }

  formSubmited() {
    if (this.formsAction === 'create') {
      this.createUser();
    } else if (this.formsAction === 'edit') {
      this.editUser();
    }
  }

  closeModal() {
      this.isModalVisible = false;
  }

  editUser() {
    this.isLoading = true; // Define isLoading como verdadeiro ao enviar o formulário

    if (this.role_id === null) {
      this.setNotification('Role ID is required', 'error');
      this.isLoading = false; // Define isLoading como falso em caso de erro
      return;
    }

    //passar isto para um modelo
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      role_id: this.role_id,
    };
    console.log(`user editado`, userData);

    //substituir com metodo de edit do service

    this.userService.updateUser(parseInt(this.userId), userData).subscribe(
      (response: any) => {
        this.setNotification('User updated successfully', 'success');
        this.clearForm();
        this.isLoading = false; // Define isLoading como falso após a conclusão do envio
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
        this.isLoading = false; // Define isLoading como falso em caso de erro
      }
    );
  }

  createUser() {
      this.isLoading = true; // Define isLoading como verdadeiro ao enviar o formulário

      if (this.role_id === null) {
          this.setNotification('Role ID is required', 'error');
          this.isLoading = false; // Define isLoading como falso em caso de erro
          return;
      }

      const userData = {
          name: this.name,
          email: this.email,
          password: this.password,
          role_id: this.role_id,
      };

      this.userService.storeUser(userData).subscribe(
          (response: any) => {
              this.setNotification('User created successfully', 'success');
              this.clearForm();
              this.isLoading = false; // Define isLoading como falso após a conclusão do envio
          },
          (error: any) => {
              const errorMessage = this.getErrorMessage(error);
              this.setNotification(errorMessage, 'error');
              this.isLoading = false; // Define isLoading como falso em caso de erro
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
      return 'An error occurred. Please try again later.';
  }

  clearForm() {
      this.name = '';
      this.email = '';
      this.password = '';
      this.role_id = null;
  }

  getRole() {
    return this.authService.getRole();
}
}
