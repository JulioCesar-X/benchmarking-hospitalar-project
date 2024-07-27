import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServiceService } from '../../core/services/service/service.service';
import { Service } from '../../core/models/service.model';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner/loading-spinner.component';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomepageComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  displayedServices: any[] = [];
  isLoading: boolean = false;
  loadingServiceId: number | null = null;
  page: number = 1;
  pageSize: number = 4;
  totalServices: number = 0;
  loadedPages: Set<number> = new Set();
  showNavButtons: boolean = true;
  userRole: string | null = null;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.startLoadingAnimation();
    this.userRole = this.authService.getRole();
    this.showIntroduction();
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServicesPaginated(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.services = data.data;
        this.totalServices = data.total;
        this.updateDisplayedServices();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao carregar serviços', err);
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
      this.loadServices();
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

  showIntroduction() {
    anime({
      targets: '.drag-handle',
      scale: [1, 1.5],
      duration: 1500,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true
    });
  }

  goToDescription(serviceId: number) {
    this.loadingServiceId = serviceId;
    const role = this.authService.getRole();
    const navigationExtras: NavigationExtras = { queryParamsHandling: 'merge' };

    if (role === 'admin' || role === 'coordenador' || role === 'root') {
      this.router.navigate(['/charts', { serviceId }], navigationExtras);
    } else if (role === 'user') {
      this.router.navigate(['/user-charts', { serviceId }], navigationExtras);
    } else {
      this.router.navigate([`/description/${serviceId}`], navigationExtras);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}