import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { IndicatorsUpsertFormComponent } from '../../../components/indicators/indicators-upsert-form/indicators-upsert-form.component';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { Indicator } from '../../../core/models/indicator.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { LoggingService } from '../../../core/services/logging.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-indicators-update-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    IndicatorsUpsertFormComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './indicators-update-page.component.html',
  styleUrls: ['./indicators-update-page.component.scss']
})
export class IndicatorsUpdatePageComponent implements OnInit, OnDestroy {
  selectedIndicator: Indicator = {
    id: -1,
    indicator_name: '',
  };
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private indicatorService: IndicatorService,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const indicatorId = +params['id'];
      if (indicatorId) {
        this.loadIndicator(indicatorId);
      }
    });
    localStorage.removeItem('activeLink');

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadIndicator(indicatorId: number): void {
    this.isLoading = true;
    this.indicatorService.showIndicator(indicatorId).subscribe({
      next: (data) => {
        this.selectedIndicator = data;
        console.log('Indicator loaded>>>', this.selectedIndicator);
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading indicator', error);
        this.isLoading = false;
      }
    });
  }
}