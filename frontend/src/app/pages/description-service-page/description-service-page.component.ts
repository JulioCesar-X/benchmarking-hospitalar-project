import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';
import { ServiceService } from '../../services/service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-description-service-page',
  standalone: true,
  imports: [
    CommonModule, // Inclua CommonModule nos imports
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './description-service-page.component.html',
  styleUrls: ['./description-service-page.component.scss'] // Corrigido para styleUrls
})
export class DescriptionServicePageComponent implements OnInit {
  service: any;

  constructor(private serviceService: ServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadService(params['serviceId']);  // Carrega o serviço baseado no ID da rota
    });
  }

  loadService(serviceId: number): void {
    this.serviceService.getServiceById(serviceId).subscribe({
      next: (data) => {
        this.service = data;  // Armazena o serviço específico retornado pela API
      },
      error: (err) => {
        console.error('Error loading the service:', err);
      }
    });
  }
}
