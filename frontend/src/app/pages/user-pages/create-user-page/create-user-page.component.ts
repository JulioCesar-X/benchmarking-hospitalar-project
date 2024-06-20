import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { UserFilterSectionComponent } from '../../../components/user/user-filter-section/user-filter-section.component';
import { CreateUserFormComponent } from '../../../components/user/create-user-form/create-user-form.component';

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [
    MenuComponent,
    UserFilterSectionComponent,
    CreateUserFormComponent,
  ],
  templateUrl: './create-user-page.component.html',
  styleUrl: './create-user-page.component.scss'
})
export class CreateUserPageComponent {

}
