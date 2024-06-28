import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { IndicatorsListSectionComponent } from '../../../components/indicators/indicators-list-section/indicators-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';

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
export class IndicatorsPageComponent {
  filteredIndicators: any[] = [];
  isLoadingSearch = false;

  constructor(private indicatorService: IndicatorService) { }

  onSearch(results: any[]): void {
    this.filteredIndicators = results;
    this.isLoadingSearch = false;
  }

  onSearchStarted(): void {
    this.isLoadingSearch = true;
  }

  onReset(): void {
    this.isLoadingSearch = true;
    this.indicatorService.getIndicatorsPaginated(0, 10).subscribe({
      next: (data) => {
        this.filteredIndicators = data.data;
        this.isLoadingSearch = false;
      },
      error: (error) => {
        console.error('Error loading indicators:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}
