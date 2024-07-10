import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
import { User } from '../../../core/models/user.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';


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
  MatSelectModule,
  LoadingSpinnerComponent],
  templateUrl: './users-upsert-form.component.html',
  styleUrl: './users-upsert-form.component.scss'
})
export class UsersUpsertFormComponent {
  loadingCircleMessage: string = "A carregar";
  @Input() formsAction: string = '';

  @Input() user: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role_id: 0
  };

  isModalVisible = false;
/*   name: string = '';
  email: string = '';
  password: string = '';
  role_id: number | null = null; */
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  isLoading = false;

  constructor(private userService: UserService, private authService: AuthService,
    private router:Router, private route: ActivatedRoute
  ) { }

  openModal(event: Event) {
      event.preventDefault();
      this.isModalVisible = true;
  }

  formSubmited() {
    this.notificationMessage = '';


    if (this.formsAction === 'create') {
      this.createUser();
      this.loadingCircleMessage = "A criar utilizador..."
    } else if (this.formsAction === 'edit') {
      this.editUser();
      this.loadingCircleMessage = "A editar utilizador..."

    }
  }

  closeModal() {
      this.isModalVisible = false;
  }

  editUser() {
    //esta parte so esta aqui para suprir uma lacuna temporaria para editar o user
    //porque o show do user no componente da pagina nao esta a funcionar e a passar os dados do user com o ID
    let userId = 0
    this.route.params.subscribe(params => {
       userId= params['id'];
    });
    this.user.id = userId;
    //eliminar codigo acima assim que o show do user estiver a funcionar!

    this.isLoading = true; // Define isLoading como verdadeiro ao enviar o formulário

    if (this.user.role_id === null) {
      this.setNotification('Role ID is required', 'error');
      this.isLoading = false; // Define isLoading como falso em caso de erro
      return;
    }

/*     const userData = {
      name: this.name,
      email: this.email,
      password: this.password,
      role_id: this.role_id,
    }; */
    console.log(`user editado`, this.user);

    //substituir com metodo de edit do service

    this.userService.updateUser(userId, this.user).subscribe(
      (response: any) => {
        this.setNotification('User updated successfully', 'success');
        this.clearForm();
        this.isLoading = false; // Define isLoading como falso após a conclusão do envio
        setTimeout(() => this.router.navigate(['/users']), 2000); // Redirect after success message

      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
        this.isLoading = false; // Define isLoading como falso em caso de erro
      }
    );
  }

  createUser() {
      this.isLoading = true; 

      if (this.user.role_id === null) {
          this.setNotification('Role ID is required', 'error');
          this.isLoading = false; // Define isLoading como falso em caso de erro
          return;
      }

/*       const userData = {
          name: this.name,
          email: this.email,
          password: this.password,
          role_id: this.role_id,
      }; */

      this.userService.storeUser(this.user).subscribe(
          (response: any) => {
              console.log("user created:", response)
              this.setNotification('User created successfully', 'success');
              this.clearForm();
              this.isLoading = false; // Define isLoading como falso após a conclusão do envio

              setTimeout(() => this.router.navigate(['/users']), 2000); // Redirect after success message
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
      this.user.name = '';
      this.user.email = '';
      this.user.password = '';
      this.user.role_id = null;
  }

  getRole() {
    return this.authService.getRole();
}
}
