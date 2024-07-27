import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { UsersListSectionComponent } from '../../../components/user/users-list-section/users-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { UserService } from '../../../core/services/user/user.service';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [
    MenuComponent,
    SearchFilterComponent,
    UsersListSectionComponent
  ],
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  filteredUsers: any[] = [];
  isLoadingSearch = false;

  constructor(private userService: UserService, private loggingService: LoggingService) { }
  ngOnInit() {
    localStorage.removeItem('activeLink');
  }
  
  onSearch(results: any[]): void {
    this.loggingService.log('Search results:', results);
    this.filteredUsers = results;
    this.isLoadingSearch = false;
  }

  onSearchStarted(): void {
    this.loggingService.log('Search started');
    this.isLoadingSearch = true;
  }

  onReset(): void {
    this.loggingService.log('Resetting search');
    this.isLoadingSearch = true;
    this.userService.getUsersPaginated(0, 10).subscribe({
      next: (data) => {
        this.loggingService.log('Users loaded:', data);
        this.filteredUsers = data.data;
        this.isLoadingSearch = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading users:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}