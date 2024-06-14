import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { IndicatorFilterSectionComponent } from '../../../components/indicator/indicator-filter-section/indicator-filter-section.component';
import { RecordsListSectionComponent } from '../../../components/records/records-list-section/records-list-section.component';
import { CommonModule } from '@angular/common';
import { GoalsListSectionComponent } from '../../../components/goals/goals-list-section/goals-list-section.component'

@Component({
  selector: 'app-update-indicators-page',
  standalone: true,
  imports: [
    MenuComponent,
    IndicatorFilterSectionComponent,
    RecordsListSectionComponent,
    GoalsListSectionComponent,
    CommonModule
  ],
  templateUrl: './update-recordsGoals-page.component.html',
  styleUrl: './update-recordsGoals-page.component.scss'
})
export class RecordsGoalsUpdatePageComponent {
  currentIndicators: any[] = [];
  isLoading = false;  // Adiciona a propriedade isLoading

  onIndicatorsUpdated(indicators: any[]) {
    this.currentIndicators = indicators;
    this.isLoading = false;  // Defina isLoading como false quando os dados forem recebidos
  }

  setLoadingState(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  selectedTab: string = 'Records';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
