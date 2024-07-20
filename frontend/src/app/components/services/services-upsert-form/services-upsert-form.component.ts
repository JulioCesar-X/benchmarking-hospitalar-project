import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { SelectableListComponent } from '../../shared/selectable-list/selectable-list.component';
import { Service } from '../../../core/models/service.model';
import { Activity } from '../../../core/models/activity.model';
import { Indicator } from '../../../core/models/indicator.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-services-upsert-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeedbackComponent,
    LoadingSpinnerComponent,
    SelectableListComponent,
    MatTooltipModule
  ],
  templateUrl: './services-upsert-form.component.html',
  styleUrls: ['./services-upsert-form.component.scss']
})
export class ServicesUpsertFormComponent implements OnInit, OnChanges {
  @Input() formsAction: string = '';
  @Input() selectedService: Service = { id: -1, service_name: '', description: '', image_url: '', more_info: '' };

  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingActivities: boolean = true;
  isLoadingIndicators: boolean = true;
  isLoading: boolean = false;
  isError: boolean = false;

  activitiesList: Activity[] = [];
  indicatorsList: Indicator[] = [];
  selectedActivityIDs: any[] = [];
  selectedIndicatorIDs: any[] = [];

  activeTab: 'activities' | 'indicators' = 'activities';

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private activityService: ActivityService,
    private indicatorService: IndicatorService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedService'] && this.formsAction === 'edit' && this.selectedService.id !== -1) {
      this.loadService(this.selectedService.id);
    }
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      await Promise.all([this.getActivities(), this.getIndicators()]);
      this.isLoading = false;
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error loading initial data', error);
      this.isLoading = false;
    }
  }

  loadService(serviceId: number): void {
    this.isLoading = true;
    this.serviceService.showService(serviceId).subscribe({
      next: (data: Service) => {
        this.selectedService = data;
        this.selectedActivityIDs = data.sais?.map(sai => sai.activity.id) || [];
        this.selectedIndicatorIDs = data.sais?.map(sai => sai.indicator.id) || [];
        console.log('selectedActivityIDs', this.selectedActivityIDs);
        console.log('selectedIndicatorIDs', this.selectedIndicatorIDs);

        this.cdRef.detectChanges();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading service', error);
        this.isLoading = false;
      }
    });
  }

  getActivities(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.activityService.indexActivities().subscribe({
        next: (data: Activity[]) => {
          this.activitiesList = data;
          resolve();
        },
        error: (error) => {
          console.error('Erro ao obter atividades', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingActivities = false;
          this.cdRef.detectChanges();
        }
      });
    });
  }

  getIndicators(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.indicatorService.indexIndicators().subscribe({
        next: (data: Indicator[]) => {
          this.indicatorsList = data;
          resolve();
        },
        error: (error) => {
          console.error('Erro ao obter indicadores', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingIndicators = false;
          this.cdRef.detectChanges();
        }
      });
    });
  }

  onActivitiesSelectionChange(selectedActivities: any[]) {
    this.selectedActivityIDs = selectedActivities.map(activity => activity.id);
    console.log('Updated selectedActivityIDs:', this.selectedActivityIDs);
  }

  onIndicatorsSelectionChange(selectedIndicators: any[]) {
    this.selectedIndicatorIDs = selectedIndicators.map(indicator => indicator.id);
    console.log('Updated selectedIndicatorIDs:', this.selectedIndicatorIDs);
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

  formSubmited() {
    if (!this.formValid()) {
      this.setNotification('Por favor, associe pelo menos uma atividade e um indicador.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.createService();
    } else if (this.formsAction === 'edit') {
      this.editService();
    }
  }

  editService() {
    if (!this.selectedActivityIDs.length || !this.selectedIndicatorIDs.length) {
      this.setNotification('Por favor, selecione pelo menos uma atividade e um indicador.', 'error');
      return;
    }

    const updatedService: Service = {
      id: this.selectedService.id,
      service_name: this.selectedService.service_name,
      description: this.selectedService.description,
      image_url: this.selectedService.image_url,
      more_info: this.selectedService.more_info,
      activity_ids: [...new Set(this.selectedActivityIDs)],  // Garantir que não haja IDs duplicados
      indicator_ids: [...new Set(this.selectedIndicatorIDs)]  // Garantir que não haja IDs duplicados
    };

    console.log('Updating service with data:', updatedService);

    this.serviceService.updateService(this.selectedService.id!, updatedService).subscribe(
      (response: any) => {
        this.setNotification('Serviço atualizado com sucesso', 'success');
        setTimeout(() => this.router.navigate(['/services']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
        console.error('Error updating service:', error);
      }
    );
  }

  createService() {
    const createdService: Service = {
      id: -1,
      service_name: this.selectedService.service_name,
      description: this.selectedService.description,
      image_url: this.selectedService.image_url,
      more_info: this.selectedService.more_info,
      activity_ids: [...new Set(this.selectedActivityIDs)],  // Garantir que não haja IDs duplicados
      indicator_ids: [...new Set(this.selectedIndicatorIDs)]  // Garantir que não haja IDs duplicados
    };

    this.serviceService.storeService(createdService).subscribe(
      (response: any) => {
        this.setNotification('Serviço criado com sucesso', 'success');
        setTimeout(() => this.router.navigate(['/services']), 2000); // Redirect after success message
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.Type = type;
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Serviço já existe';
    }
    if (error.status === 400) {
      return 'Entrada inválida';
    }
    return 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
  }

  formValid(): boolean {
    return this.selectedActivityIDs.length > 0 && this.selectedIndicatorIDs.length > 0;
  }

  selectTab(tab: 'activities' | 'indicators') {
    this.activeTab = tab;
  }
}