import { Component, OnInit, OnChanges, Input, SimpleChanges, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { DesassociationListComponent } from '../../../components/shared/desassociation-list/desassociation-list.component';
import { AssociationListComponent } from '../../../components/shared/association-list/association-list.component';
import { Activity, CreateActivity } from '../../../core/models/activity.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggingService } from '../../../core/services/logging.service';


@Component({
  selector: 'app-activities-upsert-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButtonModule,
    FormsModule,
    FeedbackComponent,
    LoadingSpinnerComponent,
    DesassociationListComponent,
    AssociationListComponent, 
    MatTooltipModule,
    DialogContentComponent,
    
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

  loadingCircleMessage = 'A carregar atividade';
  notificationMessage = '';
  Type: 'success' | 'error' = 'success';
  activityNameError = '';

  isLoadingServices = true;
  isLoadingIndicators = true;
  @Input() isLoading = false;
  isLoadingDesassociacao = false;
  isLoadingAssociacao = false;
  isError = false;

  servicesList: any[] = [];
  indicatorsList: any[] = [];
  saisList: any[] = [];
  selectedServicesIDs: number[] = [];
  selectedIndicatorsIDs: number[] = [];
  selectedSaisIDs: number[] = [];
  desassociations: { sai_id: number }[] = [];
  associations: { service_id: number, indicator_id: number }[] = [];

  activeTab: 'Associação' | 'Desassociação' = 'Associação';

  constructor(
    private router: Router,
    private activityService: ActivityService,
    private serviceService: ServiceService,
    private indicatorService: IndicatorService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private loggingService: LoggingService
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
      this.loggingService.error('Error loading initial data', error);
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
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading activity', error);
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
        this.isLoading = false;
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
          this.loggingService.error('Error obtaining services', error);
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
          this.loggingService.error('Error obtaining indicators', error);
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

    this.loggingService.log('Associations:', this.associations);
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

    this.loggingService.log('Associations:', this.associations);
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

    this.loggingService.log('Desassociations:', this.desassociations);
    this.cdr.detectChanges();
  }

  formValid(): boolean {
    return this.selectedActivity.activity_name.trim() !== '' &&
      (this.associations.length > 0 || this.desassociations.length > 0);
  }

  validateActivityName() {
    if (this.selectedActivity.activity_name.length > 80) {
      this.activityNameError = 'O nome da atividade não pode ter mais de 80 caracteres.';
    } else {
      this.activityNameError = '';
    }
  }

  formSubmited(): void {
    if (!this.formValid() || this.activityNameError) {
      this.setNotification('Por favor, preencha todos os campos obrigatórios e corrija os erros.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.loadingCircleMessage = "A criar atividade";
      this.createActivity();
    } else if (this.formsAction === 'edit') {
      this.loadingCircleMessage = "A editar atividade";
      this.editActivity();
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.Type = type;
  }

  editActivity() {
    this.isLoading = true;
    const updatedActivity: Activity = {
      id: this.selectedActivity.id,
      activity_name: this.selectedActivity.activity_name,
      associations: this.associations,
      desassociations: this.desassociations
    };

    this.activityService.updateActivity(this.selectedActivity.id, updatedActivity).subscribe(
      (response: any) => {
        this.setNotification('Atividade atualizada com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/activities']);
          this.isLoading = false;
        }, 2000);
      },
      (error: any) => {
        this.isLoading = false;
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  createActivity() {
    this.isLoading = true;
    const createdActivity: CreateActivity = {
      activity_name: this.selectedActivity.activity_name,
      associations: this.associations,
    };

    this.activityService.storeActivity(createdActivity).subscribe(
      (response: any) => {
        this.setNotification('Atividade criada com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/activities']);
          this.isLoading = false;
        }, 2000);
      },
      (error: any) => {
        this.isLoading = false;
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Atividade já existe';
    }
    if (error.status === 400) {
      if (error.error.error === 'Nome da atividade já existe.') {
        return 'Nome da atividade já existe.';
      }
      if (error.error.error.startsWith('Associação duplicada detectada')) {
        return error.error.error;
      }
      return 'Entrada inválida';
    }
    return 'Ocorreu um erro. Por favor, tente novamente mais tarde.';
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

  openDialog(event: { selected: any[], deselected: any[] }): void {

      const dialogRef = this.dialog.open(DialogContentComponent, {
        data: {
          message: `Tem certeza que deseja continuar com essa operação? Desassociar implica a perda de dados relacionados!`,
          loadingMessage: 'Removendo ligação...'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onSaisSelectionChange(event);
        }
      });
  }
}