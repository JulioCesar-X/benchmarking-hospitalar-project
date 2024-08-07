import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { UserService } from '../../../core/services/user/user.service';
import { UsersUpsertFormComponent } from '../../../components/user/users-upsert-form/users-upsert-form.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-user-update-page',
  standalone: true,
  imports: [
    MenuComponent,
    UsersUpsertFormComponent,
    LoadingSpinnerComponent,
    CommonModule
  ],
  templateUrl: './user-update-page.component.html',
  styleUrls: ['./user-update-page.component.scss']
})
export class UserUpdatePageComponent implements OnInit {
  isLoading = true;
  selectedUser: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    nif: '',
    role_id: 0,
    roles: []
  };
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private loggingService: LoggingService // Inject LoggingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(userId);
      }
    });
    localStorage.removeItem('activeLink');

  }

  loadUser(userId: number): void {
    this.isLoading = true;
    this.userService.showUser(userId).subscribe({
      next: (data) => {
        this.loggingService.log('User loaded:', data);
        this.selectedUser = data;
        this.selectedUser.role_id = data.roles.length > 0 ? data.roles[0].id : 0;
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading user', error);
        this.isLoading = false;
      }
    });
  }
}