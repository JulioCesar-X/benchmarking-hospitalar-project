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
import { Indicator, CreateIndicator } from '../../../core/models/indicator.model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-indicators-upsert-form',
  standalone: true,
  imports: [
    CommonModule, MatFormField, MatLabel, MatInput, MatButtonModule, MatTooltipModule,
    FormsModule,
    FeedbackComponent,
    LoadingSpinnerComponent,
    DesassociationListComponent,
    AssociationListComponent
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

  loadingCircleMessage: string = "A carregar indicadores..."
  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';
  indicatorNameError: string = '';

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

  activeTab: 'Associação' | 'Desassociação' = 'Associação';

  constructor(
    private router: Router,
    private indicatorService: IndicatorService,
    private serviceService: ServiceService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private loggingService: LoggingService
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
      this.loggingService.error('Error loading initial data', error);
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
        this.updateSelectedItems();
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading indicator', error);
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
          this.loggingService.error('Error obtaining activities', error);
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
    event.selected.forEach(service => {
      this.selectedActivitiesIDs.forEach(activity_id => {
        if (!this.associations.some(association => association.service_id === service.id && association.activity_id === activity_id)) {
          this.associations.push({ service_id: service.id, activity_id });
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

  onActivitiesSelectionChange(event: { selected: any[], deselected: any[] }): void {
    event.selected.forEach(activity => {
      this.selectedServicesIDs.forEach(service_id => {
        if (!this.associations.some(association => association.service_id === service_id && association.activity_id === activity.id)) {
          this.associations.push({ service_id, activity_id: activity.id });
        }
      });
    });

    event.deselected.forEach(activity => {
      this.associations = this.associations.filter(association => association.activity_id !== activity.id);
    });

    this.selectedActivitiesIDs = event.selected.map(activity => activity.id);

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
    return this.selectedIndicator.indicator_name.trim() !== '' &&
      (this.associations.length > 0 || this.desassociations.length > 0);
  }

  validateIndicatorName(): void {
    if (this.selectedIndicator.indicator_name.length > 100) {
      this.indicatorNameError = 'O nome do indicador não pode ter mais de 100 caracteres.';
    } else {
      this.indicatorNameError = '';
    }
  }

  formSubmited(): void {
    this.validateIndicatorName();

    if (!this.formValid() || this.indicatorNameError) {
      this.setNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.loadingCircleMessage = "A criar indicador"
      this.createIndicator();
    } else if (this.formsAction === 'edit') {
      this.loadingCircleMessage = "A editar indicador"
      this.editIndicator();
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.Type = type;
  }

  createIndicator(): void {
    this.isLoading = true;
    const createdIndicator: CreateIndicator = {
      indicator_name: this.selectedIndicator.indicator_name,
      associations: this.associations
    };

    this.indicatorService.storeIndicator(createdIndicator).subscribe(
      (response: any) => {
        this.setNotification('Indicador criado com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/indicators']);
          this.isLoading = false;
        }, 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
        this.isLoading = false;
      }
    );
  }

  editIndicator(): void {
    this.isLoading = true;
    const updatedIndicator = {
      id: this.selectedIndicator.id,
      indicator_name: this.selectedIndicator.indicator_name,
      associations: this.associations,
      desassociations: this.desassociations
    };

    this.indicatorService.updateIndicator(this.selectedIndicator.id, updatedIndicator).subscribe(
      (response: any) => {
        this.setNotification('Indicador atualizado com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/indicators']);
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
    if (error.status === 400) {
      if (error.error.error === 'Nome do indicador já existe.') {
        return 'Nome do indicador já existe.';
      }
      if (error.error.error.startsWith('Associação duplicada detectada')) {
        return error.error.error;
      }
      return 'Entrada inválida.';
    }
    if (error.status === 404) {
      return 'Indicador não encontrado.';
    }
    if (error.status === 409) {
      return 'Indicador já existe.';
    }
    return 'Ocorreu um erro. Tente novamente mais tarde.';
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