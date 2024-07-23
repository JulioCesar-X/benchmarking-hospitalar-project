import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
    DragDropModule,
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
  showNavButtons: boolean = false;
  userRole: string | null = null; // Propriedade para armazenar a função do usuário

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadServices();
    this.startLoadingAnimation();
    this.userRole = this.authService.getRole(); // Inicializa a função do usuário
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

  goToDescription(serviceId: number) {
    this.loadingServiceId = serviceId;
    const role = this.authService.getRole();
    if (role === 'admin' || role === 'coordenador' || role === 'root') {
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

  drop(event: CdkDragDrop<Service[]>) {
    console.log('Item moved from', event.previousIndex, 'to', event.currentIndex);
    moveItemInArray(this.displayedServices, event.previousIndex, event.currentIndex);
    this.saveOrder();
  }

  saveOrder() {
    console.log('Saving order', this.displayedServices);
    this.serviceService.updateServiceOrder(this.displayedServices).subscribe({
      next: () => {
        console.log('Ordem dos serviços atualizada com sucesso.');
      },
      error: (err) => {
        console.error('Erro ao atualizar a ordem dos serviços.', err);
      }
    });
  }

}