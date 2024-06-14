import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import {ServicesCreateFormComponent} from '../../../components/services/services-create-form/services-create-form.component'

@Component({
  selector: 'app-create-services-page',
  standalone: true,
  imports: [FilterComponent,
    MenuComponent,
    ServicesCreateFormComponent],
  templateUrl: './create-services-page.component.html',
  styleUrl: './create-services-page.component.scss'
})
export class CreateServicesPageComponent {

}
