import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { CardComponent } from '../../shared/card/card.component';
import { Service } from '../../../core/models/service.model';
import { ServiceService } from '../../../core/services/service/service.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { PageEvent, MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { CustomMatPaginatorIntl } from '../../shared/paginator/customMatPaginatorIntl';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-services-list-section',
  templateUrl: './services-list-section.component.html',
  styleUrls: ['./services-list-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatDialogModule,
    FormsModule,
    LoadingSpinnerComponent,
    PaginatorComponent,
    DialogContentComponent,
    CardComponent,
    MatTooltipModule,
    FeedbackComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ],
})
export class ServicesListSectionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() services: Service[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;
  allServices: Service[] = [];
  loadedPages: Set<number> = new Set();
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private router: Router,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    this.loadServices(0, 30);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['services'] && !changes['services'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.services.length;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  ngAfterViewInit() {
    this.updateDataSource();
  }

  loadServices(pageIndex = 0, pageSize = 30): void {
    this.isLoading = true;
    this.serviceService.getServicesPaginated(pageIndex + 1, pageSize).subscribe({
      next: (data) => {
        if (pageIndex === 0) {
          this.allServices = data.data;
        } else {
          this.allServices = [...this.allServices, ...data.data];
        }
        this.totalLength = data.total;
        this.updateDataSource();
        this.loadedPages.add(pageIndex);
        this.isLoading = false;
      },
      error: (error) => {
        this.setNotification('Error loading paginated services', 'error');
        this.loggingService.error('Error loading paginated services:', error);
        this.isLoading = false;
      }
    });
  }

  openDialog(service: Service | null, action: string): void {
    if (action === 'delete' && service) {
      const dialogRef = this.dialog.open(DialogContentComponent, {
        data: {
          message: `Tem a certeza que quer remover o serviço ${service.service_name}?`,
          loadingMessage: 'Removendo serviço...'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteService(service.id);
        }
      });
    } else if (action === 'edit' && service) {
      this.router.navigate([`/services/update/${service.id}`]);
    } else if (action === 'create') {
      this.router.navigate(['/services/create']);
    }
  }

  deleteService(serviceId: number): void {
    this.isLoading = true;
    this.serviceService.destroyService(serviceId).subscribe({
      next: (data) => {
        this.setNotification('Serviço excluído com sucesso', 'success');
        this.loadServices(this.currentPage, this.pageSize);
      },
      error: (error) => {
        this.setNotification('Erro ao excluir serviço', 'error');
        this.loggingService.error('Error deleting service:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (!this.loadedPages.has(this.currentPage)) {
      this.loadServices(this.currentPage, this.pageSize * 3);
    } else {
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.services = this.allServices.slice(startIndex, endIndex);
  }

  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notificationMessage = '';
    }, 2000);
  }
}