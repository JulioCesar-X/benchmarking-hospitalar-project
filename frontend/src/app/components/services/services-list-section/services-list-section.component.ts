import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectableListComponent } from '../../shared/selectable-list/selectable-list.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { CardComponent } from '../../shared/card/card.component';
import { Service } from '../../../core/models/service.model';
import { ServiceService } from '../../../core/services/service/service.service';
import { TooltipButtonComponent } from '../../shared/tooltip-button/tooltip-button.component';


@Component({
  selector: 'app-services-list-section',
  templateUrl: './services-list-section.component.html',
  styleUrls: ['./services-list-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    LoadingSpinnerComponent,
    PaginatorComponent,
    SelectableListComponent,
    DialogContentComponent,
    CardComponent,
    TooltipButtonComponent
  ]
})
export class ServicesListSectionComponent implements OnInit, OnChanges {
  @Input() services: Service[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;

  constructor(
    private serviceService: ServiceService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.services.length) {
      this.loadServices();
    } else {
      this.isLoading = false;
    }
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

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServicesPaginated(this.currentPage,this.pageSize).subscribe({
      next: (data) => {
        this.services = data.data;
        this.totalLength = data.total;
        this.currentPage = data.current_page;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading paginated services:', error);
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
    this.serviceService.destroyService(serviceId).subscribe({
      next: (data) => {
        this.loadServices();
      },
      error: (error) => {
        console.error("Error deleting service:", error);
      }
    });
  }

  onPageChanged(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadServices();
  }
}
