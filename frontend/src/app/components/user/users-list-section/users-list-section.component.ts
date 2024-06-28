import { Component, OnInit, Input, OnChanges, SimpleChanges, input } from '@angular/core';
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
@Input() filter: string = "";

  allUsers: any[] = [];
  displayedUsers: any[] = [];
  isLoading: boolean = false;
  isDeletingUser: boolean = false;
  
  totalUsers: number = 0;

  currentPage: number = 1;
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
    console.log(`users list - filtro recebido:`, this.filter)
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userService.getAllUsers(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.allUsers = response.data;
          //this.filterUsers();
          this.length = response.total;
          
          console.log(this.allUsers, this.length)
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

  


  //JMS
  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent: PageEvent | undefined;

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;


    console.log(this.pageIndex + 1, this.pageSize)
    this.loadUsers();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  editUser(user: any): void {

    const userData = { id: user.id, name: user.name, email: user.email, password: user.password, roleId: user.roles[0]?.id };
    
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
