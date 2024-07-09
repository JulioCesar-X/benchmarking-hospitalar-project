import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { UserService } from '../../../core/services/user/user.service';
import { UsersUpsertFormComponent } from '../../../components/user/users-upsert-form/users-upsert-form.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-user-update-page',
  standalone: true,
  imports: [MenuComponent,UsersUpsertFormComponent, LoadingSpinnerComponent, CommonModule],
  templateUrl: './user-update-page.component.html',
  styleUrls: ['./user-update-page.component.scss']
})
  
export class UserUpdatePageComponent {
  isLoading = true;
  selectedUser: User = {
    id: 0,
    name: '',
    email: '',
    password: '',
    role_id: 0
  };
  userId: number = 0;

  constructor(private route: ActivatedRoute, private userService:UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (userId) {
        this.loadUser(userId);
      }
    });
  }

  loadUser(userId: number): void {
    this.isLoading = true;
    this.userService.showUser(userId).subscribe({
      next: (data) => {
        this.selectedUser = data;
        this.isLoading = false; // <-- Will be updated once data is fully loaded
      },
      error: (error) => {
        console.error('Error loading activity', error);
        this.isLoading = false;
      }
    });
  }
}
