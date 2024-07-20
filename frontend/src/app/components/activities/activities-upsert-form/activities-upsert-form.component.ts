import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { FeedbackComponent } from '../../../components/shared/feedback/feedback.component';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { DesassociationListComponent } from '../../../components/shared/desassociation-list/desassociation-list.component';
import { AssociationListComponent } from '../../../components/shared/association-list/association-list.component';
import { Activity, CreateActivity } from '../../../core/models/activity.model';
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
    DesassociationListComponent,
    AssociationListComponent
  ],
  templateUrl: './activities-upsert-form.component.html',
  styleUrls: ['./activities-upsert-form.component.scss']
})
export class ActivitiesUpsertFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() formsAction: string = '';
  @Input() selectedActivity: Activity = {
    id: -1,
    activity_name: '',
  };

  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingServices: boolean = true;
  isLoadingIndicators: boolean = true;
  isLoadingDesassociacao: boolean = false;
  isLoadingAssociacao: boolean = false;
  isLoading: boolean = false;
  isError: boolean = false;

  servicesList: any[] = [];
  indicatorsList: any[] = [];
  saisList: any[] = [];
  selectedServicesIDs: number[] = [];
  selectedIndicatorsIDs: number[] = [];
  selectedSaisIDs: number[] = [];
  desassociations: { sai_id: number }[] = [];
  associations: { service_id: number, indicator_id: number }[] = [];

  activeTab: 'Desassociação' | 'Associação' = 'Desassociação';

  constructor(
    private router: Router,
    private activityService: ActivityService,
    private serviceService: ServiceService,
    private indicatorService: IndicatorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedActivity'] && !changes['selectedActivity'].firstChange) {
      this.loadActivity(this.selectedActivity.id);
    }
  }

  async loadInitialData() {
    this.isLoading = true;
    try {
      await Promise.all([this.getServices(), this.getIndicators()]);
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading initial data', error);
      this.isLoading = false;
      this.cdr.detectChanges();
    }

    if (this.formsAction === 'edit' && this.selectedActivity.id !== -1) {
      this.loadActivity(this.selectedActivity.id);
    }
  }

  ngAfterViewInit(): void {
    if (this.formsAction === 'edit' && this.selectedActivity.id !== -1) {
      this.loadActivity(this.selectedActivity.id);
    }
  }

  loadActivity(activityId: number): void {
    this.isLoading = true;
    this.activityService.showActivity(activityId).subscribe({
      next: (data: Activity) => {
        this.selectedActivity = data;
        this.saisList = data.sais?.map(sai => ({
          sai_id: sai.id,
          service_id: sai.service?.id,
          indicator_id: sai.indicator?.id,
          service_name: sai.service?.service_name,
          indicator_name: sai.indicator?.indicator_name
        })) || [];
        this.selectedSaisIDs = this.saisList.map(sai => sai.sai_id);
        this.updateSelectedItems();
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading activity', error);
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

  onServicesSelectionChange(event: { selected: any[], deselected: any[] }): void {
    event.selected.forEach(service => {
      this.selectedIndicatorsIDs.forEach(indicator_id => {
        if (!this.associations.some(association => association.service_id === service.id && association.indicator_id === indicator_id)) {
          this.associations.push({ service_id: service.id, indicator_id });
        }
      });
    });

    event.deselected.forEach(service => {
      this.associations = this.associations.filter(association => association.service_id !== service.id);
    });

    this.selectedServicesIDs = event.selected.map(service => service.id);

    console.log('Associations:', this.associations);
    this.cdr.detectChanges();
  }

  onIndicatorsSelectionChange(event: { selected: any[], deselected: any[] }): void {
    event.selected.forEach(indicator => {
      this.selectedServicesIDs.forEach(service_id => {
        if (!this.associations.some(association => association.service_id === service_id && association.indicator_id === indicator.id)) {
          this.associations.push({ service_id, indicator_id: indicator.id });
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
    return this.selectedActivity.activity_name.trim() !== '' &&
      (this.associations.length > 0 || this.desassociations.length > 0);
  }

  formSubmited(): void {
    if (!this.formValid()) {
      this.setNotification('Please fill all required fields and select at least one service and one indicator.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.createActivity();
    } else if (this.formsAction === 'edit') {
      this.editActivity();
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.Type = type;
  }

  createActivity(): void {
    const createdActivity: CreateActivity = {
      activity_name: this.selectedActivity.activity_name,
      associations: this.associations,
    };

    this.activityService.storeActivity(createdActivity).subscribe(
      (response: any) => {
        this.setNotification('Activity created successfully', 'success');
        setTimeout(() => this.router.navigate(['/activities']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  editActivity(): void {
    const updatedActivity: Activity = {
      id: this.selectedActivity.id,
      activity_name: this.selectedActivity.activity_name,
      associations: this.associations,
      desassociations: this.desassociations
    };

    this.activityService.updateActivity(this.selectedActivity.id, updatedActivity).subscribe(
      (response: any) => {
        this.setNotification('Activity updated successfully', 'success');
        setTimeout(() => this.router.navigate(['/activities']), 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Activity already exists';
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