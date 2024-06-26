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

// import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import { CommonModule } from '@angular/common';  // Importar CommonModule para ngFor
// import { RouterModule } from '@angular/router';  // Importar RouterModule para routerLink
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
//   ],
//   templateUrl: './homepage.component.html',
//   styleUrls: ['./homepage.component.scss']
// })
// export class HomepageComponent implements OnInit, OnDestroy {
//   services: Service[] = [];
//   uniqueServices: Service[] = [];
//   isLoading: boolean = true;
//   page: number = 1;
//   pageSize: number = 10;

//   constructor(private serviceService: ServiceService, private router: Router) { }

//   ngOnInit(): void {
//     this.startLoadingAnimation();
//     this.loadServices();
//   }

//   ngOnDestroy(): void {
//     this.isLoading = false; // Para a animação quando o componente é destruído
//   }

//   // loadServices(): void {
//   //   this.isLoading = true; // Carregamento em andamento

//   //   this.serviceService.getPaginatedServices(this.page, this.pageSize).subscribe({
//   //     next: (data: Service[]) => {
//   //       console.log('Services loaded:', data);
//   //       this.uniqueServices = this.groupServices(data);
//   //     },
//   //     error: (err) => {
//   //       console.error('Error loading services:', err);
//   //     },
//   //     complete: () => {
//   //       this.isLoading = false; // Indica que o carregamento foi concluído
//   //     }
//   //   });
//   // }

//   @HostListener('window:scroll', [])
//   onScroll(): void {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !this.isLoading) {
//       this.loadServices();
//     }
//   }

//   startLoadingAnimation() {
//     const animate = () => {
//       if (!this.isLoading) return;
//       anime({
//         targets: '.random-demo .el',
//         translateX: () => anime.random(0, 270),
//         easing: 'easeInOutQuad',
//         duration: 600,
//         complete: animate
//       });
//     };
//     animate();
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

//   scrollToTop(): void {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
// }

// import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { ServiceService } from '../../services/service.service';
// import { Service } from '../../models/service.model';
// import { Router } from '@angular/router';
// import anime from 'animejs/lib/anime.es.js';
// import { MatIconModule } from '@angular/material/icon';

// @Component({
//   selector: 'app-homepage',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatIconModule
//   ],
//   templateUrl: './homepage.component.html',
//   styleUrls: ['./homepage.component.scss']
// })
// export class HomepageComponent implements OnInit, OnDestroy {
//   services: Service[] = [];
//   uniqueServices: Service[] = [];
//   isLoading: boolean = false;
//   page: number = 1;
//   pageSize: number = 2;
//   hasMoreServices: boolean = true; 

//   constructor(private serviceService: ServiceService, private router: Router) { }

//   ngOnInit(): void {
//     this.loadServices();
//     this.startLoadingAnimation();
//   }

//   ngOnDestroy(): void {
//     this.isLoading = false;
//   }

//   loadServices(): void {
//     if (this.isLoading || !this.hasMoreServices) return;

//     this.isLoading = true;
//     this.serviceService.getPaginatedServices(this.page, this.pageSize).subscribe({
//       next: (data: Service[]) => {
//         const newServices = data;
//         if (newServices.length < this.pageSize) {
//           this.hasMoreServices = false; 
//         }
//         this.uniqueServices = [...this.uniqueServices, ...newServices];
//       },
//       error: (err) => {
//         console.error('Error loading services:', err);
//         this.isLoading = false;
//       },
//       complete: () => {
//         this.isLoading = false;
//       }
//     });
//   }

//   loadNextServices(): void {
//     if (this.isLoading || !this.hasMoreServices) return;

//     this.page++;
//     this.loadServices();
//   }

//   loadPreviousServices(): void {
//     if (this.isLoading || this.page <= 1) return;

//     this.page--;
//     this.uniqueServices.splice(-this.pageSize); // Remove os últimos serviços carregados
//   }

//   // @HostListener('window:scroll', [])
//   // onScroll(): void {
//   //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !this.isLoading) {
//   //     this.loadServices();
//   //   }
//   // }

//   startLoadingAnimation() {
//     const animate = () => {
//       if (!this.isLoading && this.uniqueServices.length) return;
//       anime({
//         targets: '.random-demo .el',
//         translateX: () => anime.random(0, 270),
//         easing: 'easeInOutQuad',
//         duration: 600,
//         complete: animate
//       });
//     };
//     animate();
//   }

//   // groupServices(services: Service[]): Service[] {
//   //   const grouped = new Map<string, Service>();

//   //   services.forEach(service => {
//   //     const key = service.service_name.startsWith('Internamento') ? 'Internamento' : service.service_name;
//   //     if (!grouped.has(key)) {
//   //       grouped.set(key, service);
//   //     }
//   //   });

//   //   return Array.from(grouped.values());
//   // }

//   goToDescription(serviceId: number) {
//     this.router.navigate(['/description', serviceId]);
//   }

//   scrollToTop(): void {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }
// }


import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { Service } from '../../models/service.model';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  displayedServices: Service[] = [];
  isLoading: boolean = false;
  page: number = 1;
  pageSize: number = 2;
  totalServices: number = 0;

  constructor(private serviceService: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadAllServices();
    this.startLoadingAnimation();
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  loadAllServices(): void {
    this.isLoading = true;
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
        this.totalServices = this.services.length;
        this.updateDisplayedServices();
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateDisplayedServices(): void {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedServices = this.services.slice(startIndex, endIndex);
  }

  loadNextServices(): void {
    if (this.page * this.pageSize < this.totalServices) {
      this.page++;
      this.updateDisplayedServices();
    }
  }

  loadPreviousServices(): void {
    if (this.page > 1) {
      this.page--;
      this.updateDisplayedServices();
    }
  }

  startLoadingAnimation() {
    const animate = () => {
      if (!this.isLoading && this.displayedServices.length) return;
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

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
