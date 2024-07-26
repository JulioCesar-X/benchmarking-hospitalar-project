import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ServicesListSectionComponent } from '../../../components/services/services-list-section/services-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { ServiceService } from '../../../core/services/service/service.service';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    SearchFilterComponent,
    ServicesListSectionComponent
  ],
  templateUrl: './services-page.component.html',
  styleUrls: ['./services-page.component.scss']
})
export class ServicesPageComponent {
  filteredServices: any[] = [];
  isLoadingSearch = false;

  constructor(private serviceService: ServiceService, private loggingService: LoggingService) { }

  onSearch(results: any[]): void {
    this.filteredServices = results;
    this.isLoadingSearch = false;
    this.loggingService.log('Search results:', results);
  }

  onSearchStarted(): void {
    this.isLoadingSearch = true;
    this.loggingService.log('Search started');
  }

  onReset(): void {
    this.isLoadingSearch = true;
    this.loggingService.log('Resetting search');
    this.serviceService.getServicesPaginated(0, 10).subscribe({
      next: (data) => {
        this.filteredServices = data.data;
        this.isLoadingSearch = false;
        this.loggingService.log('Services loaded:', data);
      },
      error: (error) => {
        this.loggingService.error('Error loading services:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}