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
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-services-upsert-form',
  standalone: true,
  imports: [
    CommonModule, MatFormField, MatLabel, MatInput, MatButtonModule,
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
    more_info: '',
    image_url: ''
  };

  loadingCircleMessage = 'A carregar serviço';
  notificationMessage: string = '';
  Type: 'success' | 'error' = 'success';

  isLoadingActivities: boolean = true;
  isLoadingIndicators: boolean = true;
  isLoadingDesassociacao: boolean = false;
  isLoadingAssociacao: boolean = false;
  @Input() isLoading: boolean = false;
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

  serviceNameError: string = '';
  descriptionError: string = '';
  moreInfoError: string = '';

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private activityService: ActivityService,
    private indicatorService: IndicatorService,
    private cdr: ChangeDetectorRef,
    private loggingService: LoggingService
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
      this.loggingService.error('Error loading initial data', error);
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
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading service', error);
        this.isLoadingDesassociacao = false;
        this.cdr.detectChanges();
        this.isLoading = false;
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
      if (file.size > 5242880) {
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
    this.validateServiceName();
    this.validateDescription();
    this.validateMoreInfo();

    if (!this.formValid() || this.serviceNameError || this.descriptionError || this.moreInfoError) {
      this.setNotification('Por favor, preencha todos os campos obrigatórios e selecione pelo menos uma atividade e um indicador.', 'error');
      return;
    }

    if (this.formsAction === 'create') {
      this.loadingCircleMessage = "A criar serviço...";
      this.createService();
    } else if (this.formsAction === 'edit') {
      this.loadingCircleMessage = "A editar serviço...";
      this.editService();
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.Type = type;
  }

  editService() {
    this.isLoading = true;
    const updatedService: Service = {
      id: this.selectedService.id,
      service_name: this.selectedService.service_name,
      description: this.selectedService.description || '',
      image_url: this.selectedService.image_url,
      more_info: this.selectedService.more_info || '',
      associations: this.associations,
      desassociations: this.desassociations
    };
    this.serviceService.updateService(this.selectedService.id, updatedService).subscribe(
      (response: any) => {
        this.setNotification('Serviço atualizado com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/services']);
          this.isLoading = false;
        }, 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  createService() {
    this.isLoading = true;
    const createdService: CreateService = {
      service_name: this.selectedService.service_name,
      description: this.selectedService.description || '',
      image_url: this.selectedService.image_url,
      more_info: this.selectedService.more_info || '',
      associations: this.associations,
    };

    this.serviceService.storeService(createdService).subscribe(
      (response: any) => {
        this.setNotification('Serviço criado com sucesso', 'success');
        setTimeout(() => {
          this.router.navigate(['/services']);
          this.isLoading = false;
        }, 2000);
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
      }
    );
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Serviço já existe';
    }
    if (error.status === 400) {
      if (error.error.error === 'Nome do serviço já existe.') {
        return 'Nome do serviço já existe.';
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

  validateServiceName(): void {
    const namePattern = /^[a-zA-ZÀ-ÿ\s]*$/;
    if (!this.selectedService.service_name || !namePattern.test(this.selectedService.service_name)) {
      this.serviceNameError = 'O nome do serviço não deve conter números ou caracteres especiais.';
    } else if (this.selectedService.service_name.length > 80) {
      this.serviceNameError = 'O nome do serviço não pode ter mais de 80 caracteres.';
    } else {
      this.serviceNameError = '';
    }
  }

  validateDescription(): void {
    if (this.selectedService.description && this.selectedService.description.length > 200) {
      this.descriptionError = 'A descrição não pode ter mais de 200 caracteres.';
    } else {
      this.descriptionError = '';
    }
  }

  validateMoreInfo(): void {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (this.selectedService.more_info && !urlPattern.test(this.selectedService.more_info)) {
      this.moreInfoError = 'O link "Mais informações" deve ser um URL válido.';
    } else {
      this.moreInfoError = '';
    }
  }
}