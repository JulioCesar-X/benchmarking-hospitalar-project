import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from '../../../core/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';

@Component({
  selector: 'app-users-list-section',
  templateUrl: './users-list-section.component.html',
  styleUrls: ['./users-list-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    PaginatorComponent,
    DialogContentComponent
  ]
})
export class UsersListSectionComponent implements OnInit, OnChanges {
  @Input() users: any[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.users.length) {
      this.loadUsers();
    } else {
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users'] && !changes['users'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.users.length;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadUsers(pageIndex = 0, pageSize = 10): void {
    this.isLoading = true;
    this.userService.getUsersPaginated(pageIndex, pageSize).subscribe({
      next: (data) => {
        this.users = data.data;
        this.totalLength = data.total;
        this.currentPage = data.pageIndex;
        console.log("Paginated users loaded:", this.users);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading paginated users:", error);
        this.isLoading = false;
      }
    });
  }

  openDialog(user: any | null, action: string): void {
    if (action === 'delete' && user) {
      const dialogRef = this.dialog.open(DialogContentComponent, {
        data: {
          message: `Tem a certeza que quer remover o usuário ${user.name}?`,
          loadingMessage: 'Removendo usuário...'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteUser(user.id);
        }
      });
    } else if (action === 'edit' && user) {
      this.router.navigate([`/users/update/${user.id}`]);
    } else if (action === 'create') {
      this.router.navigate(['/users/create']);
    }
  }

  deleteUser(userId: number): void {
    this.userService.destroyUser(userId).subscribe({
      next: (data) => {
        this.loadUsers(this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.error("Error deleting user:", error);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers(this.currentPage, this.pageSize);
  }
}
