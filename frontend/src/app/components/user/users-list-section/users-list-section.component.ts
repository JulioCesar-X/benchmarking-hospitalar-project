import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { UserService } from '../../../core/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

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
    DialogContentComponent,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSortModule,
  ],
})
export class UsersListSectionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() users: any[] = [];
  @Input() isLoading = true;
  @Input() pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;

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
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['users'] && !changes['users'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.users.length;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsersPaginated(this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.users = data.data;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.sort = this.sort;
        this.totalLength = data.total;
        this.currentPage = data.current_page;
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
        this.loadUsers();
      },
      error: (error) => {
        console.error("Error deleting user:", error);
      }
    });
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'email':
          return this.compare(a.email, b.email, isAsc);
        case 'role':
          return this.compare(a.roles[0]?.role_name, b.roles[0]?.role_name, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' }) * (isAsc ? 1 : -1);
  }
}