// import { Component } from '@angular/core';
// import { FormsModule, } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { UserService } from '../../../services/user.service';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: number;
// }

// @Component({
//   selector: 'app-users-list-section',
//   standalone: true,
//   imports: [
//     FormsModule,
//     CommonModule,
//   ],

//   templateUrl: './users-list-section.component.html',
//   styleUrl: './users-list-section.component.scss'
// })
// export class UsersListSectionComponent {
//   allUsers: any[] = [];

//   constructor(private userService: UserService) { }

//   ngOnInit(): void {
//     this.userService.getAllUsers().subscribe({
//       next: (data) => {
//         if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
//           this.allUsers = data.map(user => ({
//             id: user.id,
//             name: user.name,
//             role: user.roles && user.roles[0] ? user.roles[0].role_name : 'No role'
//           }));
//         } else {
//           console.warn('Data is not an array:', data);
//         }
//       },
//       error: (error) => {
//         console.error('Erro ao obter usuários', error);
//       }
//     });
//   }

//   editUser(id: number): void {
//     const user = this.allUsers.find(user => user.id === id);
//     this.userService.editUser(id, user).subscribe({
//       next: (data) => {
//         console.log('User data:', data);
//       },
//       error: (error) => {
//         console.error('Error editing user:', error);
//       }
//     });

//   }

//   removeUser(id: number): void {
//     this.userService.deleteUser(id).subscribe({
//       next: () => {
//         this.allUsers = this.allUsers.filter(user => user.id !== id);
//         alert('User removed successfully');
//       },
//       error: (error) => {
//         console.error('Error removing user:', error);
//       }
//     });
//   }

//   trackByIndex(index: number, item: any): any {
//     return item.id;
//   }

// }

import { Component, OnInit, Input, OnChanges, SimpleChanges, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';

interface User {
  id: number;
  name: string;
  roles: { role_name: string }[];
}

@Component({
  selector: 'app-users-list-section',
  standalone: true,
  imports: [FormsModule, CommonModule, MatPaginatorModule],
  templateUrl: './users-list-section.component.html',
  styleUrls: ['./users-list-section.component.scss']
})

export class UsersListSectionComponent implements OnInit, OnChanges {
  allUsers: any[] = [];
  isLoading: boolean = false;
  @Input() searchTerm: string = '';
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(private userService: UserService) {}


  ngOnInit(): void {
    this.loadUsers();
  }
//sempre que search term mudar corre tudo de novo/requestá API
  ngOnChanges(changes: SimpleChanges): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers({ search: this.searchTerm, page: this.currentPage, pageSize: this.pageSize }).subscribe({
      next: (data) => {
        if (data && Array.isArray(data.users)) {
          this.allUsers = data.users.map((user: User) => ({
            id: user.id,
            name: user.name,
            role: user.roles && user.roles[0] ? user.roles[0].role_name : 'No role'
          }));
          this.totalUsers = data.totalUsers;
        } else {
          console.warn('Data is not an array:', data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao obter usuários', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0; // Reset to first page on search
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  editUser(id: number): void {
    const user = this.allUsers.find(user => user.id === id);
    this.userService.editUser(id, user).subscribe({
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
        this.allUsers = this.allUsers.filter(user => user.id !== id);
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
