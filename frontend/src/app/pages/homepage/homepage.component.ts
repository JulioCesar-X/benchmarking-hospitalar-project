import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importar CommonModule para ngFor
import { RouterModule } from '@angular/router';  // Importar RouterModule para routerLink
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model'; // Asegure-se de que este modelo esteja definido corretamente
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  services: Service[] = [];
  uniqueServices: Service[] = [];

  constructor(private serviceService: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        console.log('Services loaded:', data);
        this.uniqueServices = this.groupServices(data);
      },
      error: (err) => {
        console.error('Error loading services:', err);
      }
    });
  }

  groupServices(services: Service[]): Service[] {
    const grouped = new Map<string, Service>();

    services.forEach(service => {
      const key = service.service_name.startsWith('Internamento') ? 'Internamento' : service.service_name;
      if (!grouped.has(key)) {
        grouped.set(key, service);
      }
    });

    return Array.from(grouped.values());
  }

  goToDescription(serviceId: number) {
    this.router.navigate(['/description', serviceId]);
  }



}
