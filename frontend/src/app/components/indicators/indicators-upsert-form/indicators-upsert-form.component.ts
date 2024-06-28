import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { FeedbackComponent } from '../../../components/shared/feedback/feedback.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { SelectableListComponent } from '../../../components/shared/selectable-list/selectable-list.component';
import { Indicator } from '../../../core/models/indicator.model';
import { ServiceActivityIndicator } from '../../../core/models/sai.model';

@Component({
  selector: 'app-indicators-upsert-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FeedbackComponent,
    LoadingSpinnerComponent,
    SelectableListComponent
  ],
  templateUrl: './indicators-upsert-form.component.html',
  styleUrls: ['./indicators-upsert-form.component.scss']
})
export class IndicatorsUpsertFormComponent implements OnInit {
  @Input() formsAction: string = '';
  @Input() selectedIndicator: Indicator = {
    id: undefined,
    indicator_name: '',
    service_ids: [],
    activity_ids: [],
    service_activity_indicators: []
  };

  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingServices: boolean = true;
  isLoadingActivities: boolean = true;
  isLoading: boolean = false;
  isError: boolean = false;

  servicesList: any[] = [];
  activitiesList: any[] = [];
  selectedServicesIDs: number[] = [];
  selectedActivitiesIDs: number[] = [];

  activeTab: 'services' | 'activities' = 'services';
  goalTargetValue: number = 0;
  selectedType: string = '';

  constructor(
    private router: Router,
    private indicatorService: IndicatorService,
    private serviceService: ServiceService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      await Promise.all([this.getServices(), this.getActivities()]);
      if (this.formsAction === 'edit' && this.selectedIndicator.id !== undefined) {
        this.loadIndicator(this.selectedIndicator.id);
      }
      this.isLoading = false;
      this.cdr.detectChanges(); // Detect changes to resolve ExpressionChangedAfterItHasBeenCheckedError
    } catch (error) {
      console.error('Error loading initial data', error);
      this.isLoading = false;
      this.cdr.detectChanges(); // Detect changes to resolve ExpressionChangedAfterItHasBeenCheckedError
    }
  }

  loadIndicator(indicatorId: number): void {
    this.isLoading = true;
    this.indicatorService.showIndicator(indicatorId).subscribe({
      next: (data: Indicator) => {
        this.selectedIndicator = data;
        this.selectedServicesIDs = (data.service_activity_indicators?.map((sai: ServiceActivityIndicator) => sai.service?.id).filter((id): id is number => id !== undefined)) || [];
        this.selectedActivitiesIDs = (data.service_activity_indicators?.map((sai: ServiceActivityIndicator) => sai.activity?.id).filter((id): id is number => id !== undefined)) || [];

        // Find the first SAI with goals and extract the first goal's target_value and type
        const firstSAIWithGoals = data.service_activity_indicators?.find((sai: ServiceActivityIndicator) => sai.goals && sai.goals.length > 0);
        if (firstSAIWithGoals && firstSAIWithGoals.goals && firstSAIWithGoals.goals.length > 0) {
          this.goalTargetValue = firstSAIWithGoals.goals[0].target_value;
          this.selectedType = firstSAIWithGoals.type || '';
        }

        console.log('Indicator goal<<<', this.goalTargetValue);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading indicator', error);
        this.isLoading = false;
      }
    });
  }

  getServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serviceService.indexServices().subscribe({
        next: (data) => {
          if (data && Array.isArray(data)) {
            this.servicesList = data.map(service => ({
              id: service.id,
              service_name: service.service_name
            }));
          } else {
            console.warn('Data is not an array:', data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Erro ao obter services', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingServices = false;
        }
      });
    });
  }

  getActivities(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.activityService.indexActivities().subscribe({
        next: (data) => {
          if (data && Array.isArray(data)) {
            this.activitiesList = data.map(activity => ({
              id: activity.id,
              activity_name: activity.activity_name
            }));
          } else {
            console.warn('Data is not an array:', data);
          }
          resolve();
        },
        error: (error) => {
          console.error('Erro ao obter atividades', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingActivities = false;
        }
      });
    });
  }

  onServicesSelectionChange(selectedServices: any[]) {
    this.selectedServicesIDs = selectedServices.map(service => service.id);
  }

  onActivitiesSelectionChange(selectedActivities: any[]) {
    this.selectedActivitiesIDs = selectedActivities.map(activity => activity.id);
  }

  formSubmited() {
    if (!this.formValid()) {
      this.setNotification('Por favor, preencha todos os campos necessários e selecione pelo menos um serviço e uma atividade.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.createIndicator();
    } else if (this.formsAction === 'edit') {
      this.editIndicator();
    }
  }

  createIndicator() {
    const createdIndicator: Indicator = {
      indicator_name: this.selectedIndicator.indicator_name,
      service_ids: this.selectedServicesIDs,
      activity_ids: this.selectedActivitiesIDs,
      service_activity_indicators: [{
        type: this.selectedType,
        goals: [{
          target_value: this.goalTargetValue,
          year: new Date().getFullYear()
        }]
      }]
    };

    this.indicatorService.storeIndicator(createdIndicator).subscribe(
      (response: any) => {
        this.setNotification('Indicador criado com sucesso', 'success');
        setTimeout(() => this.router.navigate(['/indicators']), 2000); // Redirect after success message
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  editIndicator() {
    const updatedIndicator: Indicator = {
      id: this.selectedIndicator.id,
      indicator_name: this.selectedIndicator.indicator_name,
      service_ids: this.selectedServicesIDs,
      activity_ids: this.selectedActivitiesIDs,
      service_activity_indicators: [{
        type: this.selectedType,
        goals: [{
          target_value: this.goalTargetValue,
          year: new Date().getFullYear()
        }]
      }]
    };

    this.indicatorService.updateIndicator(this.selectedIndicator.id!, updatedIndicator).subscribe(
      (response: any) => {
        this.setNotification('Indicador editado com sucesso', 'success');
        setTimeout(() => this.router.navigate(['/indicators']), 2000); // Redirect after success message
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
      return 'Indicador já existe';
    }
    if (error.status === 400) {
      return 'Entrada inválida';
    }
    return 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
  }

  formValid(): boolean {
    return !!(this.selectedIndicator.indicator_name && this.selectedServicesIDs.length > 0 && this.selectedActivitiesIDs.length > 0 && this.goalTargetValue);
  }

  selectTab(tab: 'services' | 'activities') {
    this.activeTab = tab;
  }
}
