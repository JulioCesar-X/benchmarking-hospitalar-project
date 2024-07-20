import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { FeedbackComponent } from '../../../components/shared/feedback/feedback.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { SelectableListComponent } from '../../../components/shared/selectable-list/selectable-list.component';
import { Indicator, CreateIndicator } from '../../../core/models/indicator.model';

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
export class IndicatorsUpsertFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() formsAction: string = '';
  @Input() selectedIndicator: Indicator = {
    id: -1,
    indicator_name: '',
  };

  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingServices: boolean = true;
  isLoadingActivities: boolean = true;
  isLoadingDesassociacao: boolean = false;
  isLoadingAssociacao: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;

  servicesList: any[] = [];
  activitiesList: any[] = [];
  saisList: any[] = [];
  selectedServicesIDs: number[] = [];
  selectedActivitiesIDs: number[] = [];
  selectedSaisIDs: number[] = [];
  desassociations: { sai_id: number }[] = [];
  associations: { service_id: number, activity_id: number }[] = [];

  activeTab: 'Desassociação' | 'Associação' = 'Desassociação';

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndicator'] && !changes['selectedIndicator'].firstChange) {
      this.loadIndicator(this.selectedIndicator.id);
    }
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      await Promise.all([this.getServices(), this.getActivities()]);
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading initial data', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }

    if (this.formsAction === 'edit' && this.selectedIndicator.id !== -1) {
      this.loadIndicator(this.selectedIndicator.id);
    }
  }

  ngAfterViewInit(): void {
    if (this.formsAction === 'edit' && this.selectedIndicator.id !== -1) {
      this.loadIndicator(this.selectedIndicator.id);
    }
  }

  loadIndicator(indicatorId: number): void {
    this.isLoading = true;
    this.indicatorService.showIndicator(indicatorId).subscribe({
      next: (data: Indicator) => {
        this.selectedIndicator = data;
        this.saisList = data.sais?.map(sai => ({
          sai_id: sai.id,
          service_id: sai.service?.id,
          activity_id: sai.activity?.id,
          service_name: sai.service?.service_name,
          activity_name: sai.activity?.activity_name
        })) || [];
        this.selectedSaisIDs = this.saisList.map(sai => sai.sai_id);
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading indicator', error);
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
      }
    });
  }

  getServices(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.serviceService.indexServices().subscribe({
        next: (data) => {
          this.servicesList = data.map(service => ({
            id: service.id,
            service_name: service.service_name
          }));
          resolve();
        },
        error: (error) => {
          console.error('Error obtaining services', error);
          reject(error);
        },
        complete: () => {
          this.isLoadingServices = false;
          this.cdr.detectChanges();
        }
      });
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

  onServicesSelectionChange(event: { selected: any[], deselected: any[] }): void {
    this.selectedServicesIDs = event.selected.map(service => service.id);
    this.updateAssociations();
    this.cdr.detectChanges();
  }

  onActivitiesSelectionChange(event: { selected: any[], deselected: any[] }): void {
    this.selectedActivitiesIDs = event.selected.map(activity => activity.id);
    this.updateAssociations();
    this.cdr.detectChanges();
  }

  onSaisSelectionChange(event: { selected: any[], deselected: any[] }): void {
    // Adicionar itens deselecionados à lista de desassociações, se ainda não estiverem presentes
    event.deselected.forEach(sai => {
      if (!this.desassociations.some(desassociation => desassociation.sai_id === sai.sai_id)) {
        this.desassociations.push({ sai_id: sai.sai_id });
      }
    });

    // Remover itens selecionados da lista de desassociações, se estiverem presentes
    event.selected.forEach(sai => {
      this.desassociations = this.desassociations.filter(desassociation => desassociation.sai_id !== sai.sai_id);
    });

    console.log('Desassociations:', this.desassociations);
    this.cdr.detectChanges();
  }

  updateAssociations(): void {
    this.associations = [];
    this.selectedServicesIDs.forEach(service_id => {
      this.selectedActivitiesIDs.forEach(activity_id => {
        this.associations.push({ service_id, activity_id });
      });
    });
  }

  formValid(): boolean {
    return this.selectedIndicator.indicator_name.trim() !== '' &&
      (this.associations.length > 0 || this.desassociations.length > 0);
  }

  formSubmited(): void {
    if (!this.formValid()) {
      this.setNotification('Please fill all required fields and select at least one service and one activity.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.createIndicator();
    } else if (this.formsAction === 'edit') {
      this.editIndicator();
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.Type = type;
  }

  createIndicator(): void {
    const createdIndicator: CreateIndicator = {
      indicator_name: this.selectedIndicator.indicator_name,
      associations: this.associations,
    };

    this.indicatorService.storeIndicator(createdIndicator).subscribe(
      (response: any) => {
        this.setNotification('Indicator created successfully', 'success');
        setTimeout(() => this.router.navigate(['/indicators']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  editIndicator(): void {
    const updatedIndicator: Indicator = {
      id: this.selectedIndicator.id,
      indicator_name: this.selectedIndicator.indicator_name,
      associations: this.associations,
      desassociations: this.desassociations
    };

    this.indicatorService.updateIndicator(this.selectedIndicator.id, updatedIndicator).subscribe(
      (response: any) => {
        this.setNotification('Indicator updated successfully', 'success');
        setTimeout(() => this.router.navigate(['/indicators']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Indicator already exists';
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
      this.selectedSaisIDs = this.saisList.map(sai => sai.sai_id);
    }
    this.cdr.detectChanges();
  }
}