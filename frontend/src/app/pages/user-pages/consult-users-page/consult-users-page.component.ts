import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { UsersListSectionComponent } from '../../../components/user/users-list-section/users-list-section.component';
import { UserFilterSectionComponent } from '../../../components/user/user-filter-section/user-filter-section.component';


@Component({
  selector: 'app-consult-users-page',
  standalone: true,
  imports: [
    MenuComponent,
    UsersListSectionComponent,
    UserFilterSectionComponent,

  ],
  templateUrl:'./consult-users-page.component.html',
  styleUrl: './consult-users-page.component.scss'
})

export class ConsultUsersPageComponent {
  searchFilter: string | undefined;

  // handleFilterData(event: string) {
  //   this.searchFilter = event;
  // }
}
