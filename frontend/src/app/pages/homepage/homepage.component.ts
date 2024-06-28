import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importar CommonModule para ngFor
import { RouterModule } from '@angular/router';  // Importar RouterModule para routerLink
import { ServiceService } from '../../core/services/service/service.service';
import { Service } from '../../core/models/service.model'; // Asegure-se de que este modelo esteja definido corretamente
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import { CardComponent } from '../../components/shared/card/card.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  uniqueServices: Service[] = [];
  isLoading: boolean = true;

  constructor(private serviceService: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.startLoadingAnimation();
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.isLoading = false; // Para a animação quando o componente é destruído
  }

  loadServices(): void {
    this.isLoading = true; // Carregamento em andamento

    this.serviceService.getServicesPaginated(1,8).subscribe({
      next: (data: Service[]) => {
        this.uniqueServices = data;
        console.log('Services loaded:',this.uniqueServices);
      },
      error: (err) => {
        console.error('Error loading services:', err);
      },
      complete: () => {
        this.isLoading = false; // Indica que o carregamento foi concluído
      }
    });
  }

  startLoadingAnimation() {
    const animate = () => {
      if (!this.isLoading) return;
      anime({
        targets: '.random-demo .el',
        translateX: () => anime.random(0, 270),
        easing: 'easeInOutQuad',
        duration: 600,
        complete: animate
      });
    };
    animate();
  }

  goToDescription(serviceId: number) {
    this.router.navigate(['/description', serviceId]);
  }
}
