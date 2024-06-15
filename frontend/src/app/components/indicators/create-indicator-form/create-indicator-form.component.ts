import { Component, OnInit } from '@angular/core';
import { CreateFieldModalComponent } from '../create-field-modal/create-field-modal.component';
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../services/indicator.service';
import { FormsModule } from '@angular/forms';
import { Service } from '../../../models/service.model';
import { Activity } from '../../../models/activity.model';
import { ServiceService } from '../../../services/service.service';
import { ActivityService } from '../../../services/activity.service';
import { Indicator } from '../../../models/indicator.model';
import { Goal } from '../../../models/Goal.model';
import { NotificationComponent } from '../../shared/notification/notification.component';

@Component({
  selector: 'app-create-indicator-form',
  standalone: true,
  imports: [
    CreateFieldModalComponent,
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './create-indicator-form.component.html',
  styleUrls: ['./create-indicator-form.component.scss']
})
export class CreateIndicatorFormComponent implements OnInit {
  isModalVisible = false;
  services: any[] = [];
  activities: any[] = [];
  indicator: Indicator = {
    indicator_name: '',
    service_id: '',
    activity_id: '',
    records: [],
    goal: {
      sai_id: 0,
      target_value: '',
      year: new Date().getFullYear()
    },
    isInserted: false,
    type: ''
  };

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading = false;
  isLoadingServices: boolean = true;
  isLoadingAtividades: boolean = true;

  constructor(
    private indicatorService: IndicatorService,
    private serviceService: ServiceService,
    private activityService: ActivityService
  ) { }

  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  ngOnInit() {
    this.getServices();
    this.getActivities();
  }




 getServices(){
    this.isLoadingServices = true;

    this.serviceService.getServices().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          this.services = data.map(service => ({
            id: service.id,
            service_name: service.service_name
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {      
        console.error('Erro ao obter services', error);
      },
      complete:() => {
        this.isLoadingServices = false;
      }
    });
  }

  getActivities(){
    this.isLoadingAtividades = true;

    this.activityService.getActivities().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          this.activities = data.map(activity => ({
            id: activity.id,
            activity_name: activity.activity_name
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Erro ao obter atividades', error);
      },
      complete:() => {
        this.isLoadingAtividades = false;
      }
    });
  }






  createIndicator() {
    this.isLoading = true;

    this.indicatorService.postIndicator(this.indicator).subscribe(
      (response: any) => {
        this.setNotification('Indicator created successfully', 'success');
        this.clearForm();
        this.isLoading = false; // Define isLoading como falso após a conclusão do envio
      },
      (error: any) => {
        const errorMessage = this.getErrorMessage(error);
        this.setNotification(errorMessage, 'error');
        this.isLoading = false; // Define isLoading como falso em caso de erro
      }
    );
  }

  onSubmit() {
    this.createIndicator();
  }

  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'Indicator already exists';
    }
    if (error.status === 400) {
      return 'Invalid input data';
    }
    return 'An error occurred. Please try again later.';
  }

  clearForm() {
    this.indicator = {
      indicator_name: '',
      service_id: '',
      activity_id: '',
      records: [],
      goal: {
        sai_id: 0,
        target_value: '',
        year: new Date().getFullYear()
      },
      isInserted: false,
      type: ''
    };
  }

  get goalTargetValue(): string | number {
    return this.indicator.goal?.target_value ?? '';
  }

  set goalTargetValue(value: string | number) {
    if (this.indicator.goal) {
      this.indicator.goal.target_value = value;
    } else {
      this.indicator.goal = {
        sai_id: 0,
        target_value: value,
        year: new Date().getFullYear()
      };
    }
  }
}
