import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import {ActivityService} from '../../../services/activity.service'

@Component({
  selector: 'app-services-list-section',
  standalone: true,
  imports: [CommonModule,
    MatPaginatorModule,
    FormsModule,],
  templateUrl: './services-list-section.component.html',
  styleUrl: './services-list-section.component.scss'
})
export class ServicesListSectionComponent {
  services: Service[] = [];
  isLoading: boolean = false;
  totalActivities: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  isError: boolean = false;
  isModalOpen: boolean = false;
  selectedService: any = "";
  
  constructor(private serviceService: ServiceService, private router: Router){}

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.isLoading = false; // Para a animação quando o componente é destruído
  }

  navigateToCreateServices(){
    this.router.navigate(['services/create']);
  }

  loadServices(): void {
    this.isLoading = true; // Carregamento em andamento

    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = this.groupServices(data);
      },
      error: (err) => {
        console.error('Error loading services:', err);
      },
      complete: () => {
        this.isLoading = false; // Indica que o carregamento foi concluído
      }
    });
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
   /*  this.loadIndicators();  */ // Carrega os usuários com a página e tamanho de página atualizados
  }
  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
}

getErrorMessage(error: any): string {
    if (error.status === 409) {
        return 'User already exists';
    }
    if (error.status === 400) {
        return 'Invalid email';
    }
    return 'An error occurred. Please try again later.';
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

navigateToEditService(service: any){

 
  const serviceData = { id: service.id, name: service.service_name,
     description: service.description, imageUrl: service.imageUrl,
   };
  this.serviceService.setServiceData(serviceData);
  console.log(serviceData);

  this.router.navigate([`services/update/${service.id}`]);
}

openModal(service: any = ""){
  this.selectedService = service != "" ? service.service_name : "";

  this.isModalOpen = true;

  console.log(this.selectedService)
}

closeModal(){
  this.isModalOpen = false;
  this.selectedService = "";
}

formSubmited(){
    this.removeService(this.selectedService);
}

removeService(serviceToRemove:any){
  //put logic to remove the serive
}
}
