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
    serviceId: "1",
    activityId: "1",
    indicatorId: "1",
    month: 1,
    year: new Date().getFullYear() - 1
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

  handleFilterData(event: Filter): void {
    this.filter = event;
    this.loadGraphData(); // Reload graph data with new filter
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
