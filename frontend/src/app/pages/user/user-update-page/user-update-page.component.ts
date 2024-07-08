import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { UsersUpsertFormComponent } from '../../../components/user/users-upsert-form/users-upsert-form.component';

@Component({
  selector: 'app-user-update-page',
  standalone: true,
  imports: [MenuComponent,UsersUpsertFormComponent],
  templateUrl: './user-update-page.component.html',
  styleUrls: ['./user-update-page.component.scss']
})
  
export class UserUpdatePageComponent {
  userId: string = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') as string;
    });
  }
}
