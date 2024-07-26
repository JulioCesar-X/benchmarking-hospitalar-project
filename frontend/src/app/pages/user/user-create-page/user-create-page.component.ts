import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { UsersUpsertFormComponent } from '../../../components/user/users-upsert-form/users-upsert-form.component';

@Component({
  selector: 'app-user-create-page',
  standalone: true,
  imports: [
    MenuComponent,
    UsersUpsertFormComponent,
    
  ],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.scss'
})
export class UserCreatePageComponent implements OnInit {
  ngOnInit()  {
    localStorage.removeItem('activeLink');

  }
}
