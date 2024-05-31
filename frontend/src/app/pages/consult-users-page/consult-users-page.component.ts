import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { AdminMenuComponent } from '../../components/admin/admin-menu/admin-menu.component';
import { UsersListSectionComponent } from '../../components/ui/users-list-section/users-list-section.component';
import { UserFilterSectionComponent } from '../../components/ui/user-filter-section/user-filter-section.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';


@Component({
  selector: 'app-consult-users-page',
  standalone: true,
  imports: [
    NavbarComponent,
    AdminMenuComponent,
    UsersListSectionComponent,
    UserFilterSectionComponent,
    FooterComponent
  ],
  templateUrl: './consult-users-page.component.html',
  styleUrl: './consult-users-page.component.scss'
})
export class ConsultUsersPageComponent {
  
}
