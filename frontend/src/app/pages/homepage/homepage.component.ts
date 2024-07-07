import { Component, OnInit, OnDestroy } from '@angular/core';
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
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  services: Service[] = [];
  displayedServices: any[] = [];
  isLoading: boolean = false;
  page: number = 1;
  pageSize: number = 8;
  totalServices: number = 0;

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
    this.isLoading = true;
    this.serviceService.getServicesPaginated(this.page, this.pageSize).subscribe({
      next: (data: any) => {
        this.services = data.data;
        this.totalServices = data.total;
        this.updateDisplayedServices();
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
    this.displayedServices = this.services;
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
      this.loadServices();
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