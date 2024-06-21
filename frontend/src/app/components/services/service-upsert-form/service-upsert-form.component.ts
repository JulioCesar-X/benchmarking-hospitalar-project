import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../../models/activity.model';
import { Indicator } from '../../../models/indicator.model';
import { Service } from '../../../models/service.model';
import { ActivityService } from '../../../services/activity.service';
import { IndicatorService } from '../../../services/indicator.service';
import { ServiceService } from '../../../services/service.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-service-upsert-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificationComponent],
  templateUrl: './service-upsert-form.component.html',
  styleUrls: ['./service-upsert-form.component.scss']
})
export class ServiceUpsertFormComponent implements OnInit {
  @Input() formsAction: 'create' | 'edit' = 'create';
  @Input() selectedServiceId?: number;
  form: FormGroup;
  allActivities: Activity[] = [];
  allIndicators: Indicator[] = [];
  selectedActivityIds: number[] = [];
  selectedIndicatorIds: number[] = [];
  activeTab: string = 'Activities';
  isLoadingActivities: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private indicatorService: IndicatorService,
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      service_name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['', Validators.required],
      selectedActivityIds: [[]],
      selectedIndicatorIds: [[]]
    });
  }

  ngOnInit(): void {
    this.loadAllActivities();
    this.loadAllIndicators();
    if (this.formsAction === 'edit' && this.selectedServiceId) {
      this.loadServiceDetails(this.selectedServiceId);
    }
  }

  loadAllActivities(): void {
    this.activityService.getActivities().subscribe({
      next: (activities: Activity[]) => {
        this.allActivities = activities;
        this.isLoadingActivities = false;
      },
      error: () => this.setNotification('Falha ao carregar atividades.', 'error')
    });
  }

  loadAllIndicators(): void {
    this.indicatorService.getIndicators().subscribe({
      next: (indicators: Indicator[]) => {
        console.log(indicators);
        this.allIndicators = indicators;
        this.isLoadingActivities = false;
      },
      error: () => this.setNotification('Falha ao carregar indicadores.', 'error')
    });
  }

  loadServiceDetails(serviceId: number): void {
    this.serviceService.getServiceById(serviceId).subscribe({
      next: (service: Service) => {
        console.log('Loaded Service:', service);

        // Atualize o FormGroup com valores apropriados
        const formValues = {
          service_name: service.service_name || '',
          description: service.description || '',
          imageUrl: service.imageUrl || null,
        };

        this.form.patchValue(formValues);

        // Verifique e extraia os IDs de atividade e indicador dos dados aninhados corretamente
        this.selectedActivityIds = service.service_activity_indicators?.map(sai =>sai.activity_id) || [];
        this.selectedIndicatorIds = service.service_activity_indicators?.map(sai =>sai.indicator_id) || [];

        // Atualize o formulário com os valores de atividade e indicador selecionados
        this.form.patchValue({
          selectedActivityIds: this.selectedActivityIds,
          selectedIndicatorIds: this.selectedIndicatorIds,
        });

        console.log('Loaded Activity IDs:', this.selectedActivityIds);
        console.log('Loaded Indicator IDs:', this.selectedIndicatorIds);
        console.log('Patched Form:', this.form.value);
        this.cdr.detectChanges(); // Garante que as mudanças são detectadas imediatamente
      },
      error: () => this.setNotification('Falha ao carregar detalhes do serviço.', 'error')
    });
  }




  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.setImageUrl(reader.result as string);
      };
      reader.onerror = () => {
        this.setNotification('Erro ao carregar a imagem.', 'error');
      };
      reader.readAsDataURL(file);
    } else {
      this.setNotification('Nenhum arquivo foi selecionado.', 'error');
    }
  }

  setImageUrl(dataUrl: string): void {
    const imageUrlControl = this.form.get('imageUrl');
    if (imageUrlControl) {
      imageUrlControl.setValue(dataUrl);
      this.setNotification('Imagem carregada com sucesso!', 'success');
    } else {
      this.setNotification('Erro ao encontrar o campo de imagem no formulário.', 'error');
    }
  }

  submitForm(): void {
    console.log("Form Submission Attempted", this.form.value);

    if (this.form.valid && this.selectedIndicatorIds.length > 0) {
      this.isSubmitting = true;

      const formData: Service = {
        ...this.form.value,
        activities: this.selectedActivityIds,
        indicators: this.selectedIndicatorIds,
        id: this.formsAction === 'edit' ? this.selectedServiceId : undefined
      };

      if (this.formsAction === 'create') {
        this.createService(formData);
      } else {
        this.editService(formData);
      }
    } else {
      this.setNotification('Por favor, preencha todos os campos necessários e selecione pelo menos um indicador.', 'error');
      console.error("Form is invalid or no indicators selected", this.form.errors);
    }
  }

  createService(formData: Service): void {
    this.serviceService.createService(formData).subscribe({
      next: (response) => {
        console.log("Service created successfully", response);
        this.setNotification('Serviço criado com sucesso!', 'success');
      },
      error: (error) => {
        console.error("Error creating service", error);
        this.setNotification('Erro ao processar a requisição.', 'error');
      }
    });
  }
  editService(formData: Service): void {
    if (formData.id) {
      this.serviceService.editService(formData.id, formData).subscribe({
        next: () => this.setNotification('Serviço editado com sucesso!', 'success'),
        error: () => this.setNotification('Erro ao processar a requisição.', 'error')
      });
    } else {
      this.setNotification('ID do serviço é necessário para a edição.', 'error');
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  toggleIndicatorSelection(indicatorId?: number): void {
    if (indicatorId === undefined) {
      console.error('Tentativa de alterar seleção de um indicador sem um ID válido.');
      return;
    }

    const index = this.selectedIndicatorIds.indexOf(indicatorId);
    if (index > -1) {
      this.selectedIndicatorIds.splice(index, 1);  // Remove o ID do array se já estiver presente
    } else {
      this.selectedIndicatorIds.push(indicatorId);  // Adiciona o ID ao array se não estiver presente
    }
  }

  toggleActivitySelection(activityId: number): void {
    const index = this.selectedActivityIds.indexOf(activityId);
    if (index > -1) {
      this.selectedActivityIds.splice(index, 1);
    } else {
      this.selectedActivityIds.push(activityId);
    }
  }

  isSelected(activityId: number): boolean {
    return this.selectedActivityIds.includes(activityId);
  }

  isSelectedIndicator(indicatorId?: number): boolean {
    return indicatorId !== undefined && this.selectedIndicatorIds.includes(indicatorId);
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }

  openTab(tabName: string): void {
    this.activeTab = tabName;
  }


}
