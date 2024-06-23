import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { AccumulatedData } from '../../models/AccumulatedData.model';
import { Filter } from '../../models/Filter.model';
import { graphData } from '../../models/graphData.model';
import { ChartComponent } from '../../components/chart/chart.component';
import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../components/shared/filter/filter.component';
import { ServiceActivityIndicatorService } from '../../services/service-activity-indicator.service';

@Component({
  selector: 'app-consult-data-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartComponent
  ],
  templateUrl: './consult-data-page.component.html',
  styleUrls: ['./consult-data-page.component.scss']
})
export class ConsultDataPageComponent implements OnInit {
  selectedTab: string = 'Producao';
  
  filter: Filter = {
    indicatorId: undefined,
    activityId: undefined,
    serviceId: undefined,
    month: new Date().getMonth() + 1,  // Current month (1-12)
    year: new Date().getFullYear()    // Current year
  };
  graphData: any;

  constructor(private saiService: ServiceActivityIndicatorService) { }

  ngOnInit(): void {
    this.loadGraphData();
  }

  loadGraphData(): void {
    this.saiService.getAllIn(this.filter).subscribe({
      next: (data) => {
        console.log('Graph data loaded:', data);
        this.graphData = data; // Store data for children to use
      },
      error: (error) => console.error('Error loading graph data:', error)
    });
  }

  handleFilterData(event: Partial<Filter>): void {

    this.filter = {
      ...this.filter,  // Preserve existing values
      ...event         // Overwrite with new values from event
    };
    console.log("filter received in parent:", this.filter)
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
