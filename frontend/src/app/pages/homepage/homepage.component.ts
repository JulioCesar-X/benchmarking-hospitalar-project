// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';  // Importar CommonModule para ngFor
// import { RouterModule } from '@angular/router';  // Importar RouterModule para routerLink
// import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
// import { FooterComponent } from '../../components/ui/footer/footer.component';
// import { ServiceService } from '../../services/service.service';
// import { Service } from '../../models/service.model'; // Asegure-se de que este modelo esteja definido corretamente
// import { Router } from '@angular/router';
// import anime from 'animejs/lib/anime.es.js';

// @Component({
//   selector: 'app-homepage',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     NavbarComponent,
//     FooterComponent
//   ],
//   templateUrl: './homepage.component.html',
//   styleUrls: ['./homepage.component.scss']
// })
// export class HomepageComponent implements OnInit {
//   services: Service[] = [];
//   uniqueServices: Service[] = [];
//   isLoading: boolean = true;

//   constructor(private serviceService: ServiceService, private router: Router) { }

//   ngOnInit(): void {
//     this.loadServices();
//   }

//   loadServices(): void {
//     this.randomValues(); //chamar função
//     this.isLoading = true; //Carregamento em andamento

//     this.serviceService.getServices().subscribe({
//       next: (data: Service[]) => {
//         console.log('Services loaded:', data);
//         this.uniqueServices = this.groupServices(data);
//       },
//       error: (err) => {
//         console.error('Error loading services:', err);
//       },
//       complete: () => {
//         this.isLoading = false; // Indica que o carregamento foi concluído
//       }
//     });
//   }

//   randomValues() {
//     anime({
//       targets: '.random-demo .el',
//       translateX: function() {
//         return anime.random(0, 270);
//       },
//       easing: 'easeInOutQuad',
//       duration: 270,
//       complete: this.randomValues // Reinicia a animação após completar
//     });
//   }

//   groupServices(services: Service[]): Service[] {
//     const grouped = new Map<string, Service>();

//     services.forEach(service => {
//       const key = service.service_name.startsWith('Internamento') ? 'Internamento' : service.service_name;
//       if (!grouped.has(key)) {
//         grouped.set(key, service);
//       }
//     });

//     return Array.from(grouped.values());
//   }

//   goToDescription(serviceId: number) {
//     this.router.navigate(['/description', serviceId]);
//   }

// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importar CommonModule para ngFor
import { RouterModule } from '@angular/router';  // Importar RouterModule para routerLink
import { NavbarComponent } from '../../components/ui/navbar/navbar.component';
import { FooterComponent } from '../../components/ui/footer/footer.component';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model'; // Asegure-se de que este modelo esteja definido corretamente
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';

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
export class HomepageComponent implements OnInit, OnDestroy {
  services: Service[] = [];
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

    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        console.log('Services loaded:', data);
        this.uniqueServices = this.groupServices(data);
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
