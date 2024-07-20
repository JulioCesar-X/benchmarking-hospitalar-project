import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { FeedbackComponent } from '../../../components/shared/feedback/feedback.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { DesassociationListComponent } from '../../../components/shared/desassociation-list/desassociation-list.component';
import { AssociationListComponent } from '../../../components/shared/association-list/association-list.component';
import { Service, CreateService } from '../../../core/models/service.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-services-upsert-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeedbackComponent,
    LoadingSpinnerComponent,
    DesassociationListComponent,
    AssociationListComponent,
    MatTooltipModule
    
  ],
  templateUrl: './services-upsert-form.component.html',
  styleUrls: ['./services-upsert-form.component.scss']
})
export class ServicesUpsertFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() formsAction: string = '';
  @Input() selectedService: Service = {
    id: -1,
    service_name: '',
    description: '',
    image_url: ''
  };

  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingActivities: boolean = true;
  isLoadingIndicators: boolean = true;
  isLoadingDesassociacao: boolean = false;
  isLoadingAssociacao: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;

  activitiesList: any[] = [];
  indicatorsList: any[] = [];
  saisList: any[] = [];
  selectedActivitiesIDs: number[] = [];
  selectedIndicatorsIDs: number[] = [];
  selectedSaisIDs: number[] = [];
  desassociations: { sai_id: number }[] = [];
  associations: { activity_id: number, indicator_id: number }[] = [];

  activeTab: 'Desassociação' | 'Associação' = 'Desassociação';

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private activityService: ActivityService,
    private indicatorService: IndicatorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedService'] && !changes['selectedService'].firstChange) {
      this.loadService(this.selectedService.id);
    }
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      await Promise.all([this.getActivities(), this.getIndicators()]);
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading initial data', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }

    if (this.formsAction === 'edit' && this.selectedService.id !== -1) {
      this.loadService(this.selectedService.id);
    }
  }

  ngAfterViewInit(): void {
    if (this.formsAction === 'edit' && this.selectedService.id !== -1) {
      this.loadService(this.selectedService.id);
    }
  }

  loadService(serviceId: number): void {
    this.isLoading = true;
    this.serviceService.showService(serviceId).subscribe({
      next: (data: Service) => {
        this.selectedService = data;
        this.saisList = data.sais?.map(sai => ({
          sai_id: sai.id,
          activity_id: sai.activity?.id,
          indicator_id: sai.indicator?.id,
          activity_name: sai.activity?.activity_name,
          indicator_name: sai.indicator?.indicator_name
        })) || [];
        this.selectedSaisIDs = this.saisList.map(sai => sai.sai_id);
        this.updateSelectedItems();
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading service', error);
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
      }
    });
  }

  getActivities(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.activityService.indexActivities().subscribe({
        next: (data) => {
          this.activitiesList = data.map(activity => ({
            id: activity.id,
            activity_name: activity.activity_name
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error obtaining activities', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingActivities = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  getIndicators(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.indicatorService.indexIndicators().subscribe({
        next: (data) => {
          this.indicatorsList = data.map(indicator => ({
            id: indicator.id,
            indicator_name: indicator.indicator_name
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error obtaining indicators', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingIndicators = false;
          this.cdr.detectChanges();
        }
      });
    });
  }

  onActivitiesSelectionChange(event: { selected: any[], deselected: any[] }): void {
    event.selected.forEach(activity => {
      this.selectedIndicatorsIDs.forEach(indicator_id => {
        if (!this.associations.some(association => association.activity_id === activity.id && association.indicator_id === indicator_id)) {
          this.associations.push({ activity_id: activity.id, indicator_id });
        }
      });
    });

    event.deselected.forEach(activity => {
      this.associations = this.associations.filter(association => association.activity_id !== activity.id);
    });

    this.selectedActivitiesIDs = event.selected.map(activity => activity.id);

    console.log('Associations:', this.associations);
    this.cdr.detectChanges();
  }

  onIndicatorsSelectionChange(event: { selected: any[], deselected: any[] }): void {
    event.selected.forEach(indicator => {
      this.selectedActivitiesIDs.forEach(activity_id => {
        if (!this.associations.some(association => association.activity_id === activity_id && association.indicator_id === indicator.id)) {
          this.associations.push({ activity_id, indicator_id: indicator.id });
        }
      });
    });

    event.deselected.forEach(indicator => {
      this.associations = this.associations.filter(association => association.indicator_id !== indicator.id);
    });

    this.selectedIndicatorsIDs = event.selected.map(indicator => indicator.id);

    console.log('Associations:', this.associations);
    this.cdr.detectChanges();
  }

  onSaisSelectionChange(event: { selected: any[], deselected: any[] }): void {
    event.deselected.forEach(sai => {
      if (!this.desassociations.some(desassociation => desassociation.sai_id === sai.sai_id)) {
        this.desassociations.push({ sai_id: sai.sai_id });
      }
    });

    event.selected.forEach(sai => {
      this.desassociations = this.desassociations.filter(desassociation => desassociation.sai_id !== sai.sai_id);
    });

    this.selectedSaisIDs = event.selected.map(sai => sai.sai_id);

    console.log('Desassociations:', this.desassociations);
    this.cdr.detectChanges();
  }

  formValid(): boolean {
    return this.selectedService.service_name.trim() !== '' &&
      (this.associations.length > 0 || this.desassociations.length > 0);
  }

    onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.size > 5242880) { // 5MB in bytes
        this.setNotification('O arquivo não pode exceder 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedService.image_url = reader.result as string;
      };
      reader.onerror = () => {
        this.setNotification('Erro ao carregar a imagem.', 'error');
      };
      reader.readAsDataURL(file);
    } else {
      this.setNotification('Nenhum arquivo foi selecionado.', 'error');
    }
  }


  formSubmited(): void {
    if (!this.formValid()) {
      this.setNotification('Please fill all required fields and select at least one activity and one indicator.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.createService();
    } else if (this.formsAction === 'edit') {
      this.editService();
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.Type = type;
  }

  createService(): void {
    const createdService: CreateService = {
      service_name: this.selectedService.service_name,
      description: this.selectedService.description,
      image_url: this.selectedService.image_url,
      more_info: this.selectedService.more_info,
      associations: this.associations,
    };

    this.serviceService.storeService(createdService).subscribe(
      (response: any) => {
        this.setNotification('Service created successfully', 'success');
        setTimeout(() => this.router.navigate(['/services']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  editService(): void {
    const updatedService: Service = {
      id: this.selectedService.id,
      service_name: this.selectedService.service_name,
      description: this.selectedService.description,
      image_url: this.selectedService.image_url,
      more_info: this.selectedService.more_info,
      associations: this.associations,
      desassociations: this.desassociations
    };

    this.serviceService.updateService(this.selectedService.id, updatedService).subscribe(
      (response: any) => {
        this.setNotification('Service updated successfully', 'success');
        setTimeout(() => this.router.navigate(['/services']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Service already exists';
    }
    if (error.status === 400) {
      return 'Invalid entry';
    }
    return 'An error occurred. Please try again later.';
  }

  selectTab(tab: 'Desassociação' | 'Associação'): void {
    this.activeTab = tab;
    this.updateSelectedItems();
  }

  updateSelectedItems(): void {
    if (this.activeTab === 'Desassociação') {
      this.selectedSaisIDs = this.saisList.filter(sai => !this.desassociations.some(d => d.sai_id === sai.sai_id)).map(sai => sai.sai_id);
    }
    this.cdr.detectChanges();
  }
}