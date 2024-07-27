import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ServicesUpsertFormComponent } from '../../../components/services/services-upsert-form/services-upsert-form.component';
import { ServiceService } from '../../../core/services/service/service.service';
import { Service } from '../../../core/models/service.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-services-update-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ServicesUpsertFormComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './services-update-page.component.html',
  styleUrls: ['./services-update-page.component.scss']
})
export class ServicesUpdatePageComponent implements OnInit, OnDestroy {
  selectedService: Service = { id: -1, service_name: '', description: '', image_url: '' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private loggingService: LoggingService
  ) { }


  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const serviceId = +params['id'];
      if (serviceId) {
        this.loadService(serviceId);
      }
    });
    localStorage.removeItem('activeLink');

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadService(serviceId: number): void {
    this.isLoading = true;
    this.serviceService.showService(serviceId).subscribe({
      next: (data) => {
        this.loggingService.log('Service loaded:', data);
        this.selectedService = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading service', error);
        this.isLoading = false;
      }
    });
  }
}