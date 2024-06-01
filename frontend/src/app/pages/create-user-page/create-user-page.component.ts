import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { MenuComponent } from '../../components/user/menu/menu.component';
import { UserFilterSectionComponent } from '../../components/user/user-filter-section/user-filter-section.component';
import { CreateUserFormComponent } from '../../components/user/create-user-form/create-user-form.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';
@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [
    NavbarComponent,
    MenuComponent,
    UserFilterSectionComponent,
    CreateUserFormComponent,
    FooterComponent
  ],
  templateUrl: './create-user-page.component.html',
  styleUrl: './create-user-page.component.scss'
})
export class CreateUserPageComponent {

}
