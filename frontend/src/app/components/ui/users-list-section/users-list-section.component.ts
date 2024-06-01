import { Component } from '@angular/core';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

interface User {
  id: number;
  name: string;
  email: string;
  role: number;
}

@Component({
  selector: 'app-users-list-section',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './users-list-section.component.html',
  styleUrl: './users-list-section.component.scss'
})
export class UsersListSectionComponent {
  options: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          this.options = data.map(user => ({
            id: user.id,
            name: user.name,
            role: user.roles && user.roles[0] ? user.roles[0].role_name : 'No role'
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Erro ao obter usuários', error);
      }
    });
  }

  editUser(id: number): void {
    const user = this.options.find(user => user.id === id);
    this.userService.editUser(id,user).subscribe({
      next: (data) => {
        console.log('User data:', data);
      },
      error: (error) => {
        console.error('Error editing user:', error);
      }
    });

  }

  removeUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.options = this.options.filter(user => user.id !== id);
        alert('User removed successfully');
      },
      error: (error) => {
        console.error('Error removing user:', error);
      }
    });
  }

  trackByIndex(index: number, item: any): any {
    return item.id;
  }

}
