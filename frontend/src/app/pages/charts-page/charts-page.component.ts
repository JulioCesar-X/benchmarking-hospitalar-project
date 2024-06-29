import { Component} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from '../../components/charts/charts.component';
import { FilterComponent } from '../../components/shared/filter/filter.component';
import { Filter } from '../../core/models/filter.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IndicatorService } from '../../core/services/indicator/indicator.service';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartsComponent
  ],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss']
})
export class ChartsPageComponent  {
  selectedTab: string = 'Producao';

  filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,  // Current month (1-12)
    year: new Date().getFullYear()    // Current year
  };
  graphData: any;

  private filterSubject = new Subject<Partial<Filter>>();

  constructor(private indicatorService: IndicatorService) { }

  ngOnInit(): void {
    this.filterSubject.pipe(
      debounceTime(300),
      switchMap(filter => this.indicatorService.getAllInDataGraphs({ ...this.filter, ...filter }))
    ).subscribe({
      next: (data) => {
        console.log('Graph data loaded:', data);
        this.graphData = data; // Store data for children to use
      },
      error: (error) => console.error('Error loading graph data:', error)
    });

    this.loadGraphData();
  }

  loadGraphData(): void {
    this.filterSubject.next(this.filter);
  }

  handleFilterData(event: Partial<Filter>): void {
    this.filter = {
      ...this.filter,  // Preserve existing values
      ...event         // Overwrite with new values from event
    };
    console.log("Filter received in parent:", this.filter);
    this.loadGraphData();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
