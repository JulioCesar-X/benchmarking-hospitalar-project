import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { SimpleFilterSectionComponent } from '../../../components/shared/simple-filter-section/simple-filter-section.component';
import { EditUserFormComponent } from '../../../components/user/edit-user-form/edit-user-form.component';

@Component({
  selector: 'app-edit-user-page',
  standalone: true,
  imports: [MenuComponent, SimpleFilterSectionComponent, EditUserFormComponent],
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
