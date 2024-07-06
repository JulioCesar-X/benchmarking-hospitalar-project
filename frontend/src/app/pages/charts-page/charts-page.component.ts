import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IndicatorService } from '../../core/services/indicator/indicator.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { FilterComponent } from '../../components/shared/filter/filter.component';
import { ChartsComponent } from '../../components/charts/charts.component';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner/loading-spinner.component';
import { Filter } from '../../core/models/filter.model';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartsComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss']
})
export class ChartsPageComponent implements OnInit {
  selectedTab: string = 'Producao';
  filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };
  graphData: any;
  isLoading = false;
  isAdminOrCoordinator: boolean = false;
  showActivityInput: boolean = false;

  private filterSubject = new Subject<Partial<Filter>>();

  constructor(
    private indicatorService: IndicatorService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdminOrCoordinator = role === 'admin' || role === 'coordenador';

    this.route.params.subscribe(params => {
      this.filter.serviceId = +params['serviceId'] || this.filter.serviceId;
      this.loadGraphData();
    });

    this.filterSubject.pipe(
      debounceTime(300),
      switchMap(filter => {
        this.isLoading = true;
        return this.indicatorService.getAllInDataGraphs({ ...this.filter, ...filter });
      })
    ).subscribe({
      next: (data) => {
        this.graphData = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadGraphData(): void {
    this.filterSubject.next(this.filter);
  }

  handleFilterData(event: Partial<Filter>): void {
    this.filter = {
      ...this.filter,
      ...event
    };
    this.loadGraphData();
  }

  handleActivityInputChange(show: boolean): void {
    this.showActivityInput = show;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}