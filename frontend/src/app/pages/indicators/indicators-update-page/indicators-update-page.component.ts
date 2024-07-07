import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { IndicatorsUpsertFormComponent } from '../../../components/indicators/indicators-upsert-form/indicators-upsert-form.component';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { Indicator } from '../../../core/models/indicator.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';

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
export class IndicatorsUpdatePageComponent implements OnInit {
  selectedIndicator: Indicator = {
    id: undefined,
    indicator_name: '',
    service_ids: [],
    activity_ids: [],
    sais: []
  };
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private indicatorService: IndicatorService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const indicatorId = params['id'];
      if (indicatorId) {
        this.loadIndicator(indicatorId);
      }
    });
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
        console.error('Error loading indicator', error);
        this.isLoading = false;
      }
    });
  }
}
