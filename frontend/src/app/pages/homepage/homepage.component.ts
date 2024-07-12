import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import { MatIconModule } from '@angular/material/icon';
import { ServiceService } from '../../core/services/service/service.service';
import { Service } from '../../core/models/service.model';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomepageComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  displayedServices: any[] = [];
  isLoading: boolean = false;
  page: number = 1;
  pageSize: number = 4;
  totalServices: number = 0;
  loadedPages: Set<number> = new Set();

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.startLoadingAnimation();
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  loadServices(): void {
    if (this.loadedPages.has(this.page)) {
      this.updateDisplayedServices();
      return;
    }

    this.isLoading = true;
    this.serviceService.getServicesPaginated(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.services = this.services.concat(data.data); // Concatenate new services
        this.totalServices = data.total;
        this.updateDisplayedServices();
        this.loadedPages.add(this.page);
      },
      error: (err) => {
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

  goToDescription(serviceId: number) {
    const role = this.authService.getRole();
    if (role === 'admin' || role === 'coordenador') {
      this.router.navigate(['/charts', { serviceId }]);
    } else if (role === 'user') {
      this.router.navigate(['/user-charts', { serviceId }]);
    } else {
      this.router.navigate([`/description/${serviceId}`]);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}