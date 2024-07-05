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
import { Activity } from '../../../core/models/activity.model';
import { Service } from '../../../core/models/service.model';
import { Indicator } from '../../../core/models/indicator.model';

@Component({
  selector: 'app-activities-upsert-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeedbackComponent,
    LoadingSpinnerComponent,
    SelectableListComponent
  ],
  templateUrl: './activities-upsert-form.component.html',
  styleUrls: ['./activities-upsert-form.component.scss']
})
export class ActivitiesUpsertFormComponent implements OnInit, OnChanges {
  @Input() formsAction: string = '';
  @Input() selectedActivity: Activity = { id: -1, activity_name: '' };

  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingServices: boolean = true;
  isLoadingIndicadores: boolean = true;
  isLoading: boolean = false;
  isError: boolean = false;

  servicesList: Service[] = [];
  indicatorsList: Indicator[] = [];
  selectedIndicatorsIDs: any[] = [];
  selectedServicesIDs: any[] = [];

  activeTab: 'services' | 'indicators' = 'services';

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
    if (changes['selectedActivity'] && this.formsAction === 'edit' && this.selectedActivity.id !== -1) {
      this.loadActivity(this.selectedActivity.id);
    }
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      await Promise.all([this.getServices(), this.getIndicators()]);
      this.isLoading = false;
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error loading initial data', error);
      this.isLoading = false;
    }
  }

  loadActivity(activityId: number): void {
    this.isLoading = true;
    this.activityService.showActivity(activityId).subscribe({
      next: (data: Activity) => {
        this.selectedActivity = data;
        this.selectedServicesIDs = data.sais?.map(sai => sai.service.id) || [];
        this.selectedIndicatorsIDs = data.sais?.map(sai => sai.indicator.id) || [];
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error loading activity', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serviceService.indexServices().subscribe({
        next: (data: Service[]) => {
          if (data && Array.isArray(data)) {
            this.servicesList = data.map(service => ({
              id: service.id,
              service_name: service.service_name,
              image_url: service.image_url,
            }));
          } else {
            console.warn('Data is not an array:', data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Erro ao obter serviços', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingServices = false;
          this.cdRef.detectChanges();
        }
      });
    });
  }

  getIndicators(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.indicatorService.indexIndicators().subscribe({
        next: (data) => {
          if (data && Array.isArray(data)) {
            this.indicatorsList = data.map(indicator => ({
              id: indicator.id,
              indicator_name: indicator.indicator_name
            }));
          } else {
            console.warn('Data is not an array:', data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Erro ao obter Indicadores', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingIndicadores = false;
          this.cdRef.detectChanges();
        }
      });
    });
  }

  onServicesSelectionChange(selectedServices: any[]) {
    this.selectedServicesIDs = selectedServices.map(service => service.id);
  }

  onIndicatorsSelectionChange(selectedIndicators: any[]) {
    this.selectedIndicatorsIDs = selectedIndicators.map(indicator => indicator.id);
  }

  formSubmited() {
    if (!this.formValid()) {
      this.setNotification('Por favor, associe pelo menos um serviço e um indicador.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.createActivity();
    } else if (this.formsAction === 'edit') {
      this.editActivity();
    }
  }

  editActivity() {
    const updatedActivity: Activity = {
      id: this.selectedActivity.id,
      activity_name: this.selectedActivity.activity_name,
      service_ids: this.selectedServicesIDs,
      indicator_ids: this.selectedIndicatorsIDs
    };

    this.activityService.updateActivity(this.selectedActivity.id!, updatedActivity).subscribe(
      (response: any) => {
        this.setNotification('Atividade atualizada com sucesso', 'success');
        setTimeout(() => this.router.navigate(['/activities']), 2000); // Redirect after success message
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  createActivity() {
    const createdActivity: Activity = {
      id: -1,
      activity_name: this.selectedActivity.activity_name,
      service_ids: this.selectedServicesIDs,
      indicator_ids: this.selectedIndicatorsIDs
    };

    this.activityService.storeActivity(createdActivity).subscribe(
      (response: any) => {
        this.setNotification('Atividade criada com sucesso', 'success');
        setTimeout(() => this.router.navigate(['/activities']), 2000); // Redirect after success message
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
      return 'Atividade já existe';
    }
    if (error.status === 400) {
      return 'Entrada inválida';
    }
    return 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
  }

  formValid(): boolean {
    return this.selectedServicesIDs.length > 0 && this.selectedIndicatorsIDs.length > 0;
  }

  selectTab(tab: 'services' | 'indicators') {
    this.activeTab = tab;
  }
}
