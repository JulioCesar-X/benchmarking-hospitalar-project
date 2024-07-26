
import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { UsersListSectionComponent } from '../../../components/user/users-list-section/users-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { UserService } from '../../../core/services/user/user.service';

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

  constructor(private userService: UserService) { }
  ngOnInit()  {
    localStorage.removeItem('activeLink');

  }
  onSearch(results: any[]): void {
    this.filteredUsers = results;
    this.isLoadingSearch = false;
  }

  onSearchStarted(): void {
    this.isLoadingSearch = true;
  }

  onReset(): void {
    this.isLoadingSearch = true;
    this.userService.getUsersPaginated(0, 10).subscribe({
      next: (data) => {
        this.filteredUsers = data.data;
        this.isLoadingSearch = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}
