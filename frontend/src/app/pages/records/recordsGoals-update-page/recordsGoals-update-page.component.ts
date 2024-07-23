import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../../components/shared/filter/filter.component';
import { Filter } from '../../../core/models/filter.model';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { RecordsListSectionComponent } from '../../../components/records/records-list-section/records-list-section.component';
import { GoalsListSectionComponent } from '../../../components/goals/goals-list-section/goals-list-section.component';

@Component({
  selector: 'app-recordsGoals-update-page',
  standalone: true,
  imports: [
    MenuComponent,
    CommonModule,
    FilterComponent,
    RecordsListSectionComponent,
    GoalsListSectionComponent
  ],
  templateUrl: './recordsGoals-update-page.component.html',
  styleUrls: ['./recordsGoals-update-page.component.scss']
})
export class RecordsGoalsUpdatePageComponent implements OnInit {
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

  constructor(
    private indicatorService: IndicatorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['recordGoalsData'];
    if (resolvedData.error) {
      console.error(resolvedData.message);
    } else {
      this.currentIndicators = resolvedData.data;
      this.filter = resolvedData.filter;
    }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    if (tab === 'Metas') {
      this.loadGoals(); // Carregar metas ao selecionar a aba
    } else {
      this.loadRecords(); // Carregar registros ao selecionar a aba
    }
  }

  handleFilterData(event: Filter): void {
    console.log('Filter data received:', event);
    this.filter = {
      ...this.filter,
      ...event
    };

    if (this.selectedTab === 'Records') {
      this.loadRecords();
    } else {
      this.loadGoals();
    }
  }

  handleActivityInputChange(show: boolean): void {
    // Placeholder function to handle activity input changes
  }

  loadRecords(): void {
    this.isLoading = true;
    const serviceId = Number(this.filter.serviceId) || 0;
    const activityId = this.filter.activityId !== null && this.filter.activityId !== undefined ? Number(this.filter.activityId) : 0;
    const year = Number(this.filter.year) || new Date().getFullYear();
    const month = Number(this.filter.month) || new Date().getMonth() + 1;

    this.indicatorService.getIndicatorsRecords(serviceId, activityId, year, month, 0, 10).subscribe(
      data => {
        console.log('Records data', data);
        this.currentIndicators = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading records', error);
        this.isLoading = false;
      }
    );
  }

  loadGoals(): void {
    this.isLoading = true;
    const serviceId = Number(this.filter.serviceId) || 0;
    const activityId = this.filter.activityId !== null && this.filter.activityId !== undefined ? Number(this.filter.activityId) : 0;
    const year = Number(this.filter.year) || new Date().getFullYear();

    this.indicatorService.getIndicatorsGoals(serviceId, activityId, year, 0, 10).subscribe(
      data => {
        console.log('Goals data', data);
        this.currentIndicators = data;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading goals', error);
        this.isLoading = false;
      }
    );
  }
}