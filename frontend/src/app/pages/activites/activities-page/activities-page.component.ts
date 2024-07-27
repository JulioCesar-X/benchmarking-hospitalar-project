import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ActivitiesListSectionComponent } from '../../../components/activities/activities-list-section/activities-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-activities-page',
  standalone: true,
  imports: [CommonModule, MenuComponent, SearchFilterComponent, ActivitiesListSectionComponent],
  templateUrl: './activities-page.component.html',
  styleUrls: ['./activities-page.component.scss']
})
export class ActivitiesPageComponent implements OnInit {
  filteredActivities: any[] = [];
  isLoadingSearch = false;

  constructor(
    private activityService: ActivityService,
    private loggingService: LoggingService
  ) { }
  ngOnInit() {
    localStorage.removeItem('activeLink');
  }
  onSearch(results: any[]): void {
    this.filteredActivities = results;
    this.isLoadingSearch = false;
  }

  onSearchStarted(): void {
    this.isLoadingSearch = true;
  }

  onReset(): void {
    this.isLoadingSearch = true;
    this.activityService.getActivitiesPaginated(0, 10).subscribe({
      next: (data) => {
        this.filteredActivities = data.data;
        this.isLoadingSearch = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading activities:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}