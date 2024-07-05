import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import anime from 'animejs/lib/anime.es.js';
import { MatIconModule } from '@angular/material/icon';
import { ServiceService } from '../../core/services/service/service.service';
import { Service } from '../../core/models/service.model';

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

  constructor(private serviceService: ServiceService, private router: Router) { }

  ngOnInit(): void {
    this.loadServices();
    this.startLoadingAnimation();
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.indexServices().subscribe({
      next: (data: any) => {
        this.services = data.data; // Assumindo que os serviços estão na propriedade 'data'
        this.totalServices = data.total; // Assumindo que o total está na propriedade 'total'
        console.log('Services:', this.services);
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