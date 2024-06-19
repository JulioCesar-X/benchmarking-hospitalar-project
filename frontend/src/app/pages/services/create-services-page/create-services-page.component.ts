import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import {ServiceUpsertFormComponent} from '../../../components/services/service-upsert-form/service-upsert-form.component'

@Component({
  selector: 'app-create-services-page',
  standalone: true,
  imports: [FilterComponent,
    MenuComponent,
    ServiceUpsertFormComponent],
  templateUrl: './create-services-page.component.html',
  styleUrl: './create-services-page.component.scss'
})
export class CreateServicesPageComponent {

}
