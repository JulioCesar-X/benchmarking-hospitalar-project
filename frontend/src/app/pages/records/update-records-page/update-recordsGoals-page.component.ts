import { Component, Input } from '@angular/core';
import { MenuComponent } from '../../../components/user/menu/menu.component';
import { RecordsListSectionComponent } from '../../../components/records/records-list-section/records-list-section.component';
import { CommonModule } from '@angular/common';
import { GoalsListSectionComponent } from '../../../components/goals/goals-list-section/goals-list-section.component'
import {FilterComponent} from "../../../components/shared/filter/filter.component"
import { Filter } from '../../../models/Filter.model'
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-update-indicators-page',
  standalone: true,
  imports: [
    MenuComponent,
    RecordsListSectionComponent,
    GoalsListSectionComponent,
    CommonModule,
    FilterComponent
  ],
  templateUrl: './update-recordsGoals-page.component.html',
  styleUrl: './update-recordsGoals-page.component.scss'
})
export class RecordsGoalsUpdatePageComponent {                                                                          
  currentIndicators: any[] = [];
  isLoading = false;  // Adiciona a propriedade isLoading

  filter: Filter = {
    indicatorId: undefined,
    activityId: undefined,
    serviceId: undefined,
    month: new Date().getMonth() + 1,  // Current month (1-12)
    year: new Date().getFullYear()    // Current year
  };

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

  handleFilterData(event: Filter): void {
    // Merge the received data into the existing filter object
    this.filter = {
      ...this.filter,  // Preserve existing values
      ...event         // Overwrite with new values from event
    };
  }
  
}
