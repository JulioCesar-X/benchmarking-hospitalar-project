import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { SimpleFilterSectionComponent } from '../../../components/shared/simple-filter-section/simple-filter-section.component';
import { CreateUserFormComponent } from '../../../components/user/create-user-form/create-user-form.component';

@Component({
  selector: 'app-create-user-page',
  standalone: true,
  imports: [
    MenuComponent,
    SimpleFilterSectionComponent,
    CreateUserFormComponent,
  ],
  templateUrl: './create-user-page.component.html',
  styleUrl: './create-user-page.component.scss'
})
export class CreateUserPageComponent {

}
