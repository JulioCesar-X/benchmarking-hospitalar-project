import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ServicesListSectionComponent } from '../../../components/services/services-list-section/services-list-section.component';
import { SearchFilterComponent } from '../../../components/shared/search-filter/search-filter.component';
import { ServiceService } from '../../../core/services/service/service.service';

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
export class ServicesPageComponent implements OnInit {
  filteredServices: any[] = [];
  isLoadingSearch = false;

  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
    localStorage.removeItem('activeLink');
   }
  onSearch(results: any[]): void {
    this.filteredServices = results;
    this.isLoadingSearch = false;
  }

  onSearchStarted(): void {
    this.isLoadingSearch = true;
  }

  onReset(): void {
    this.isLoadingSearch = true;
    this.serviceService.getServicesPaginated(0, 10).subscribe({
      next: (data) => {
        this.filteredServices = data.data;
        this.isLoadingSearch = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoadingSearch = false;
      }
    });
  }
}
