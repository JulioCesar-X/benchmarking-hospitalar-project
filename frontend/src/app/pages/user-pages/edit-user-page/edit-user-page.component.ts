import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { UserFilterSectionComponent } from '../../../components/user/user-filter-section/user-filter-section.component';
import { EditUserFormComponent } from '../../../components/user/edit-user-form/edit-user-form.component';

@Component({
  selector: 'app-edit-user-page',
  standalone: true,
  imports: [
    MenuComponent,
    UserFilterSectionComponent,
    EditUserFormComponent,
      ],
  templateUrl: './edit-user-page.component.html',
  styleUrls: ['./edit-user-page.component.scss']
})

export class EditUserPageComponent {
  userId: string  = "";

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id') as string;
    });
  }
}
