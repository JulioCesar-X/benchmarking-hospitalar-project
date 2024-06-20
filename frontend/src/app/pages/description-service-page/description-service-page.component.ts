import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule
import { ServiceService } from '../../services/service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-description-service-page',
  standalone: true,
  imports: [
    CommonModule, // Inclua CommonModule nos imports
    ],
  templateUrl: './description-service-page.component.html',
  styleUrls: ['./description-service-page.component.scss'] // Corrigido para styleUrls
})
export class DescriptionServicePageComponent implements OnInit {
  service: any;
  isLoading: boolean = false; //Add para load

  constructor(private serviceService: ServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadService(params['serviceId']);  // Carrega o serviço baseado no ID da rota
    });
  }

  loadService(serviceId: number): void {
    this.isLoading = true //Carregamento em andamento
    this.serviceService.getServiceById(serviceId).subscribe({
      next: (data) => {
        this.service = data;  // Armazena o serviço específico retornado pela API
      },
      error: (err) => {
        console.error('Error loading the service:', err);
      },
      complete: () => {
        this.isLoading = false; // Indica que o carregamento foi concluído
      }
    });
  }
}
