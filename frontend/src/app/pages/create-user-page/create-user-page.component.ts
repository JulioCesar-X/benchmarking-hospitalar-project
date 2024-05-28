import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { AdminMenuComponent } from '../../components/admin/admin-menu/admin-menu.component';
import { UserFilterSectionComponent } from '../../components/ui/user-filter-section/user-filter-section.component';

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [NavbarComponent,
    AdminMenuComponent,
    UserFilterSectionComponent
  ],
  templateUrl: './create-user-page.component.html',
  styleUrl: './create-user-page.component.scss'
})
export class CreateUserPageComponent {

}
