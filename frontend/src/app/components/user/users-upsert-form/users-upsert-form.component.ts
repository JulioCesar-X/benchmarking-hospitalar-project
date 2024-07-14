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
    password: '',
    role_id: 0,
    roles: []
  };

  isModalVisible = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading = false;

  constructor(private userService: UserService, private authService: AuthService,
    private router: Router, private route: ActivatedRoute) { }

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

  editUser() {
    this.isLoading = true;

    if (this.user.role_id === null) {
      this.setNotification('Role ID is required', 'error');
      this.isLoading = false;
      return;
    }

    this.userService.updateUser(this.user.id, this.user).subscribe(
      (response: any) => {
        this.setNotification('User updated successfully', 'success');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/users']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
        this.isLoading = false;
      }
    );
  }

  createUser() {
    this.isLoading = true;

    if (this.user.role_id === null) {
      this.setNotification('Role ID is required', 'error');
      this.isLoading = false;
      return;
    }

    this.authService.register(this.user).subscribe(
      (response: any) => {
        this.setNotification('User created successfully', 'success');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/users']), 2000);
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