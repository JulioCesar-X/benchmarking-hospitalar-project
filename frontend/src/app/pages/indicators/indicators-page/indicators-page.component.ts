import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { IndicatorsListSectionComponent } from '../../../components/indicators/indicators-list-section/indicators-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-indicators-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    SearchFilterComponent,
    IndicatorsListSectionComponent
  ],
  templateUrl: './indicators-page.component.html',
  styleUrls: ['./indicators-page.component.scss']
})
export class IndicatorsPageComponent implements OnInit {
  filteredIndicators: any[] = [];
  isLoadingSearch = false;

  constructor(
    private indicatorService: IndicatorService,
    private loggingService: LoggingService
  ) { }

  ngOnInit() {
    localStorage.removeItem('activeLink');
   }

  onSearch(results: any[]): void {
    this.filteredIndicators = results;
    this.isLoadingSearch = false;
  }

  onSearchStarted(): void {
    this.isLoadingSearch = true;
  }

  onReset(): void {
    this.isLoadingSearch = true;
    this.indicatorService.getIndicatorsPaginated(1, 10).subscribe({
      next: (data) => {
        this.filteredIndicators = data.data;
        this.isLoadingSearch = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading indicators:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}