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

// import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { UserService } from '../../../services/user.service';
// import { RouterLink, Router } from '@angular/router';

// @Component({
//   selector: 'app-users-list-section',
//   standalone: true,
//   imports: [FormsModule, CommonModule, MatPaginatorModule, RouterLink],
//   templateUrl: './users-list-section.component.html',
//   styleUrls: ['./users-list-section.component.scss']
// })

// export class UsersListSectionComponent implements OnInit, OnChanges {
//   allUsers: any[] = [];
//   displayedUsers: any[] = [];  // Usuários para mostrar na página atual
//   isLoading: boolean = false;
//   totalUsers: number = 0;
//   pageSize: number = 10;
//   currentPage: number = 0;

//   @Input() searchTerm: string = '';

//   constructor(private userService: UserService, private router: Router) { }

//   ngOnInit(): void {
//     this.loadUsers();
//   }
//   //sempre que search term mudar corre tudo de novo/requestá API
//   ngOnChanges(changes: SimpleChanges): void {
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     this.isLoading = true;
//     this.userService.getAllUsers(this.currentPage + 1, this.pageSize).subscribe({
//       next: (response) => {
//         if (response && response.data) {
//           this.displayedUsers = response.data;
//           this.totalUsers = response.total;
//         } else {
//           console.warn('Nenhum usuário foi carregado ou a resposta está mal formatada', response);
//         }
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Erro ao obter usuários', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   onSearch(searchTerm: string): void {
//     this.searchTerm = searchTerm;
//     this.currentPage = 0; // Reset to first page on search
//     this.loadUsers();
//   }

//   onPageChange(event: PageEvent): void {
//     this.currentPage = event.pageIndex;
//     this.pageSize = event.pageSize;
//     this.loadUsers();  // Carrega os usuários com a página e tamanho de página atualizados
//   }

//   editUser(user: any): void {
//     console.log("User to be edited:", user);

//     const userData = { id: user.id, name: user.name, email: user.email, password: user.password,
//       roleId: user.role_id
//      }; // Create user data object
//     this.userService.setUserData(userData);
//     this.router.navigate(['/editUser/'+ user.id]);


//     //ver se o router link funciona atraves da imagem, se sim apagar isto! Deixa

// /*     const user = this.allUsers.find(user => user.id === id);
//     this.userService.editUser(id, user).subscribe({
//       next: (data) => {
//         console.log('Dados user:', data);
//       },
//       error: (error) => {
//         console.error('Error ao editar user:', error);
//       }
//     }); */
//   }

//   removeUser(id: number): void {
//     this.userService.deleteUser(id).subscribe({
//       next: () => {
//         this.allUsers = this.allUsers.filter(user => user.id !== id);
//         alert('User removido com successo');
//       },
//       error: (error) => {
//         console.error('Error ao remover user:', error);
//       }
//     });
//   }

//   trackByIndex(index: number, item: any): any {
//     return item.id;
//   }

//   updateDisplayedUsers(): void {
//     if (this.allUsers) {
//       const start = this.currentPage * this.pageSize;
//       const end = start + this.pageSize;
//       this.displayedUsers = this.allUsers.slice(start, end);
//     } else {
//       console.warn('Tentativa de atualizar usuários exibidos, mas allUsers é undefined.');
//     }
//   }

// }


// import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { UserService } from '../../../services/user.service';
// import { RouterLink, Router } from '@angular/router';

// @Component({
//   selector: 'app-users-list-section',
//   standalone: true,
//   imports: [FormsModule, CommonModule, MatPaginatorModule, RouterLink],
//   templateUrl: './users-list-section.component.html',
//   styleUrls: ['./users-list-section.component.scss']
// })
// export class UsersListSectionComponent implements OnInit, OnChanges {
//   allUsers: any[] = [];
//   displayedUsers: any[] = [];  // Usuários para mostrar na página atual
//   isLoading: boolean = false;
//   totalUsers: number = 0;
//   pageSize: number = 10;
//   currentPage: number = 0;

//   @Input() searchTerm: string = '';

//   constructor(private userService: UserService, private router: Router) { }

//   ngOnInit(): void {
//     this.loadUsers();
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     this.loadUsers();
//   }

//   loadUsers(): void {
//     this.isLoading = true;
//     this.userService.getAllUsers(this.currentPage + 1, this.pageSize).subscribe({
//       next: (response) => {
//         if (response && response.data) {
//           this.displayedUsers = response.data;
//           this.totalUsers = response.total;
//         } else {
//           console.warn('Nenhum usuário foi carregado ou a resposta está mal formatada', response);
//         }
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Erro ao obter usuários', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   onSearch(searchTerm: string): void {
//     this.searchTerm = searchTerm;
//     this.currentPage = 0; // Reset to first page on search
//     this.loadUsers();
//   }

//   onPageChange(event: PageEvent): void {
//     this.currentPage = event.pageIndex;
//     this.pageSize = event.pageSize;
//     this.loadUsers();  // Carrega os usuários com a página e tamanho de página atualizados
//   }

//   editUser(user: any): void {
//     console.log("User to be edited:", user);
//     const userData = {
//       id: user.id, name: user.name, email: user.email, password: user.password, roleId: user.role_id
//     }; // Create user data object
//     this.userService.setUserData(userData);
//     this.router.navigate(['/editUser/' + user.id]);
//   }

//   removeUser(id: number): void {
//     this.userService.deleteUser(id).subscribe({
//       next: () => {
//         this.allUsers = this.allUsers.filter(user => user.id !== id);
//         alert('User removido com successo');
//       },
//       error: (error) => {
//         console.error('Error ao remover user:', error);
//       }
//     });
//   }

//   trackByIndex(index: number, item: any): any {
//     return item.id;
//   }

//   updateDisplayedUsers(): void {
//     if (this.allUsers) {
//       const start = this.currentPage * this.pageSize;
//       const end = start + this.pageSize;
//       this.displayedUsers = this.allUsers.slice(start, end);
//     } else {
//       console.warn('Tentativa de atualizar usuários exibidos, mas allUsers é undefined.');
//     }
//   }
// }

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { UserService } from '../../../services/user.service';
import { RouterLink, Router } from '@angular/router';
import { NotificationComponent } from '../../shared/notification/notification.component';

@Component({
  selector: 'app-users-list-section',
  standalone: true,
  imports: [FormsModule, CommonModule, MatPaginatorModule, RouterLink, NotificationComponent],
  templateUrl: './users-list-section.component.html',
  styleUrls: ['./users-list-section.component.scss']
})
export class UsersListSectionComponent implements OnInit, OnChanges {
  allUsers: any[] = [];
  displayedUsers: any[] = [];
  isLoading: boolean = false;
  isDeletingUser: boolean = false;
  
  totalUsers: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  searchTerm: string = '';

  isError: boolean = false;
  isModalOpen: boolean = false;
  selectedUser: any = "";

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers(this.currentPage + 1, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.allUsers = response.data;
          this.filterUsers();
          this.totalUsers = response.total;
        } else {
          this.setNotification('Nenhum usuário foi carregado ou a resposta está mal formatada', 'error');
          console.warn('Nenhum usuário foi carregado ou a resposta está mal formatada', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao obter usuários', error);
        this.isLoading = false;
      }
    });
  }
  
  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
}

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0; // Reset to first page on search
    this.filterUsers();
  }

  filterUsers(): void {
    if (this.searchTerm) {
      this.displayedUsers = this.allUsers.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.updateDisplayedUsers();
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  editUser(user: any): void {
    const userData = { id: user.id, name: user.name, email: user.email, password: user.password, roleId: user.role_id };
    this.userService.setUserData(userData);
    this.router.navigate(['/editUser/' + user.id]);
  }

  removeUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.allUsers = this.allUsers.filter(user => user.id !== id);
        this.filterUsers();
        this.isDeletingUser = false;
        this.closeModal();
        this.setNotification('User eliminado com sucesso', 'success');
      },
      error: (error) => {
        this.isDeletingUser = false;
        this.setNotification('Erro ao eliminar user', 'error');

        console.error('Error ao remover user:', error);
      }
    });
  }

  trackByIndex(index: number, item: any): any {
    return item.id;
  }

  updateDisplayedUsers(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedUsers = this.allUsers.slice(start, end);
  }

  openModal(user: any = ""){
    this.selectedUser = user != "" ? user : "";
  
    this.isModalOpen = true;
  
    console.log(this.selectedUser.name)
  }
  
  closeModal(){
    this.isModalOpen = false;
    this.selectedUser = "";
  }

  formSubmited(){
    this.isDeletingUser = true;
    this.removeUser(this.selectedUser.id);
}
}
