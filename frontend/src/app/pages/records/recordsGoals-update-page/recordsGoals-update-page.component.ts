import { Component } from '@angular/core';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { GoalsListSectionComponent } from '../../../components/goals/goals-list-section/goals-list-section.component';
import { RecordsListSectionComponent } from '../../../components/records/records-list-section/records-list-section.component';
import { FilterComponent } from '../../../components/shared/filter/filter.component';
import { Filter } from '../../../core/models/filter.model';

@Component({
  selector: 'app-recordsGoals-update-page',
  standalone: true,
  imports: [
    MenuComponent,
    RecordsListSectionComponent,
    GoalsListSectionComponent,
    CommonModule,
    FilterComponent
  ],
  templateUrl: './recordsGoals-update-page.component.html',
  styleUrls: ['./recordsGoals-update-page.component.scss']
})
export class RecordsGoalsUpdatePageComponent {
  currentIndicators: any[] = [];
  isLoading = false;

  filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };

  selectedTab: string = 'Records';

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  handleFilterData(event: Filter): void {
    console.log('Filter data received:', event);
    this.filter = {
      ...this.filter,
      ...event
    };
  }

  handleActivityInputChange(show: boolean): void {
    // Placeholder function to handle activity input changes
  }
}