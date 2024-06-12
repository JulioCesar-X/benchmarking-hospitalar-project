import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { IndicatorFilterSectionComponent } from '../../../components/indicator/indicator-filter-section/indicator-filter-section.component';
import { IndicatorsListSectionComponent } from '../../../components/indicator/indicators-list-section/indicators-list-section.component';
import { CommonModule } from '@angular/common';
import { GoalsListSectionComponent} from '../../../components/goals/goals-list-section/goals-list-section.component'

@Component({
  selector: 'app-update-indicators-page',
  standalone: true,
  imports: [
    MenuComponent,
    IndicatorFilterSectionComponent,
    IndicatorsListSectionComponent,
    GoalsListSectionComponent,
    CommonModule
  ],
  templateUrl: './update-indicators-page.component.html',
  styleUrl: './update-indicators-page.component.scss'
})
export class UpdateIndicatorsPageComponent {
  currentIndicators: any[] = [];

  onIndicatorsUpdated(indicators: any[]) {
    this.currentIndicators = indicators;
  }


  /*  */
  selectedTab: string = 'Records';

  selectTab(tab: string) {
    console.log(this.selectTab)
    this.selectedTab = tab;
  }
}
