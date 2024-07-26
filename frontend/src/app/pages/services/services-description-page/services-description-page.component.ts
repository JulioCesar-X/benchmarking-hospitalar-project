import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-services-description-page',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './services-description-page.component.html',
  styleUrls: ['./services-description-page.component.scss']
})
export class ServicesDescriptionPageComponent implements OnInit {
  service: any;
  isLoading: boolean = false;

  constructor(
    private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadService(params['serviceId']);
    });
  }

  loadService(serviceId: number): void {
    this.isLoading = true;
    this.serviceService.showService(serviceId).subscribe({
      next: (data) => {
        this.loggingService.log('Service loaded successfully', data);
        this.service = data;
      },
      error: (err) => {
        this.loggingService.error('Error loading the service:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goToHomepage(): void {
    this.router.navigate(['/']);
  }
}