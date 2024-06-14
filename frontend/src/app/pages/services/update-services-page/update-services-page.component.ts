import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import {ServicesEditFormComponent} from '../../../components/services/services-edit-form/services-edit-form.component'


@Component({
  selector: 'app-update-services-page',
  standalone: true,
  imports: [FilterComponent,
    MenuComponent,
    ServicesEditFormComponent],
  templateUrl: './update-services-page.component.html',
  styleUrl: './update-services-page.component.scss'
})
export class UpdateServicesPageComponent {

}
