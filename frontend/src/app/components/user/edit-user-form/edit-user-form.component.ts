import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateFieldModalComponent } from '../../shared/create-field-modal/create-field-modal.component';
import { UserService } from '../../../core/services/user/user.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { AuthService } from '../../../core/services/auth/auth.service';
@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateFieldModalComponent,
    FeedbackComponent
  ],
  templateUrl: './edit-user-form.component.html',
  styleUrl: './edit-user-form.component.scss'
})
export class EditUserFormComponent implements OnInit {
  @Input() userId: string = "";

  isModalVisible = false;
  name: string = '';
  email: string = '';
  password: string = '';
  role_id: number | null = 1;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  isLoading = false; // Adicionando a variável para controlar o estado de carregamento

  constructor(private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    // this.indexUser();
  }

  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
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
