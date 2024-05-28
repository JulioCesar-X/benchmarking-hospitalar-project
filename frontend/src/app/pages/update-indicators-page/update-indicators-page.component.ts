import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { AdminMenuComponent } from '../../components/admin/admin-menu/admin-menu.component';
import { IndicatorFilterSectionComponent } from '../../components/ui/indicator-filter-section/indicator-filter-section.component';
import { IndicatorsListSectionComponent } from '../../components/ui/indicators-list-section/indicators-list-section.component';


@Component({
  selector: 'app-update-indicators-page',
  standalone: true,
  imports: [NavbarComponent,
    AdminMenuComponent,
    IndicatorFilterSectionComponent,
    IndicatorsListSectionComponent
  ],
  templateUrl: './update-indicators-page.component.html',
  styleUrl: './update-indicators-page.component.scss'
})
export class UpdateIndicatorsPageComponent {

}
