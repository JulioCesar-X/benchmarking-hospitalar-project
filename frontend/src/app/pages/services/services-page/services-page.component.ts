import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import {ServicesListSectionComponent} from '../../../components/services/services-list-section/services-list-section.component'
import { SimpleFilterSectionComponent } from '../../../components/shared/simple-filter-section/simple-filter-section.component';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [    FilterComponent,
    MenuComponent,
    ServicesListSectionComponent,
    SimpleFilterSectionComponent],
  templateUrl: './services-page.component.html',
  styleUrl: './services-page.component.scss'
})
export class ServicesPageComponent {

}
