// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
// import { RouterLink, Router } from '@angular/router';
// import { ServiceService } from '../../../services/service.service';
// import { Service } from '../../../models/service.model';
// import {ActivityService} from '../../../services/activity.service'

// @Component({
//   selector: 'app-services-list-section',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatPaginatorModule,
//     FormsModule,
//   ],
//   templateUrl: './services-list-section.component.html',
//   styleUrl: './services-list-section.component.scss'
// })
// export class ServicesListSectionComponent {
//   services: Service[] = [];
//   isLoading: boolean = false;
//   isDeleting: boolean = false;  // Separate loading state for deletion
//   totalActivities: number = 0;
//   pageSize: number = 10;
//   currentPage: number = 0;
//   notificationMessage: string = '';
//   notificationType: 'success' | 'error' = 'success';

//   isError: boolean = false;
//   isModalOpen: boolean = false;
//   selectedService: number = -1;

//   constructor(private serviceService: ServiceService, private router: Router, private cdr:ChangeDetectorRef){}

//   ngOnInit(): void {
//     this.loadServices();
//   }

//   ngOnDestroy(): void {
//     this.isLoading = false; // Para a animação quando o componente é destruído
//   }



//   loadServices(): void {
//     this.isLoading = true; // Carregamento em andamento
//     this.serviceService.getServices().subscribe({
//       next: (data: Service[]) => {
//         this.services = this.groupServices(data);
//       },
//       error: (err) => {
//         console.error('Error loading services:', err);
//       },
//       complete: () => {
//         this.isLoading = false; // Indica que o carregamento foi concluído
//       }
//     });
//   }

//   trackByIndex(index: number, item: any): number {
//     return item.id;
//   }

//   onPageChange(event: PageEvent): void {
//     this.currentPage = event.pageIndex;
//     this.pageSize = event.pageSize;
//    /*  this.loadIndicators();  */ // Carrega os usuários com a página e tamanho de página atualizados
//   }
//   setNotification(message: string, type: 'success' | 'error') {
//     this.notificationMessage = message;
//     this.notificationType = type;
// }

//   getErrorMessage(error: any): string {
//       if (error.status === 409) {
//           return 'User already exists';
//       }
//       if (error.status === 400) {
//           return 'Invalid email';
//       }
//       return 'An error occurred. Please try again later.';
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

//   navigateToEditService(service: Service): void {
//     this.router.navigate(['/services/update', service.id]);
//   }
//   navigateToCreateServices() {
//     this.router.navigate(['services/create']);
//   }

//   openModal(service:number){
//     this.selectedService = service;
//     console.log("name??:" ,this.selectedService)
//     this.isModalOpen = true;
//   }

//   closeModal() {
//     this.isModalOpen = false;
//     this.cdr.detectChanges();  // Opcional, se você quiser forçar a UI a atualizar após fechar
//   }

//   formSubmited(): void {
//     this.isDeleting = true;
//     this.serviceService.removeService(this.selectedService).subscribe({
//       next: () => {
//         this.setNotification('Serviço removido com sucesso!', 'success');
//         this.isDeleting = false;
//         this.closeModal();
//         this.loadServices();
//       },
//       error: (error) => {
//         console.error("Error removing service", error);
//         this.setNotification('Erro ao processar a requisição.', 'error');
//         this.isDeleting = false;
//       }
//     });
//   }

// }


import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import { ActivityService } from '../../../services/activity.service';

@Component({
  selector: 'app-services-list-section',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    FormsModule,
  ],
  templateUrl: './services-list-section.component.html',
  styleUrls: ['./services-list-section.component.scss']
})
export class ServicesListSectionComponent implements OnInit {
  services: Service[] = [];
  displayedServices: Service[] = [];
  isLoading: boolean = false;
  isDeleting: boolean = false;  // Separate loading state for deletion
  totalActivities: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  searchTerm: string = '';

  isError: boolean = false;
  isModalOpen: boolean = false;
  selectedService: number = -1;

  constructor(private serviceService: ServiceService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.isLoading = false; // Para a animação quando o componente é destruído
  }

  loadServices(): void {
    this.isLoading = true; // Carregamento em andamento
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = data;
        this.filterServices();
        this.isLoading = false; // Indica que o carregamento foi concluído
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.isLoading = false;
      }
    });
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedServices();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 0; // Reset to first page on search
    this.filterServices();
  }

  filterServices(): void {
    if (this.searchTerm) {
      this.displayedServices = this.services.filter(service =>
        service.service_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.updateDisplayedServices();
    }
  }

  updateDisplayedServices(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedServices = this.services.slice(start, end);
  }

  navigateToEditService(service: Service): void {
    this.router.navigate(['/services/update', service.id]);
  }

  navigateToCreateServices() {
    this.router.navigate(['services/create']);
  }

  openModal(service: number) {
    this.selectedService = service;
    console.log("name??:", this.selectedService);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.cdr.detectChanges();  // Opcional, se você quiser forçar a UI a atualizar após fechar
  }

  formSubmited(): void {
    this.isDeleting = true;
    this.serviceService.removeService(this.selectedService).subscribe({
      next: () => {
        this.loadServices();
        this.closeModal();
      },
      error: (error) => {
        console.error("Error removing service", error);
        this.isDeleting = false;
      }
    });
  }
}
