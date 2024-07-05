import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ServicesUpsertFormComponent } from '../../../components/services/services-upsert-form/services-upsert-form.component';
import { ServiceService } from '../../../core/services/service/service.service';
import { Service } from '../../../core/models/service.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';

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
export class ServicesUpdatePageComponent implements OnInit {
  selectedService: Service = { id: -1, service_name: '', description: '', image_url: '' };
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.loadService(serviceId);
      }
    });
  }

  loadService(serviceId: number): void {
    this.isLoading = true;
    this.serviceService.showService(serviceId).subscribe({
      next: (data) => {
        this.selectedService = data;
        this.isLoading = false; // Será atualizado uma vez que os dados sejam totalmente carregados
      },
      error: (error) => {
        console.error('Error loading service', error);
        this.isLoading = false;
      }
    });
  }
}
