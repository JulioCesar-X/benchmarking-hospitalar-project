import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { CommonModule } from '@angular/common';
import { IndicatorsListSectionComponent } from '../../../components/indicators/indicators-list-section/indicators-list-section.component'
import { FilterComponent } from '../../../components/shared/filter/filter.component'
import { SimpleFilterSectionComponent } from '../../../components/shared/simple-filter-section/simple-filter-section.component';

@Component({
  selector: 'app-indicators-list-page',
  standalone: true,
  imports: [
    MenuComponent,
    CommonModule,
    IndicatorsListSectionComponent,
    FilterComponent,
    SimpleFilterSectionComponent

  ],
  templateUrl: './indicators-list-page.component.html',
  styleUrl: './indicators-list-page.component.scss'
})
export class IndicatorsListPageComponent {

}
