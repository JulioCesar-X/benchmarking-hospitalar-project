import { Component, OnInit } from '@angular/core';
import { CreateFieldModalComponent } from '../create-field-modal/create-field-modal.component'
import { CommonModule } from '@angular/common';
import { IndicatorService } from '../../../services/indicator.service';
import { Goal } from '../../../models/Goal.model';
import { FormsModule } from '@angular/forms';
import { Service } from '../../../models/service.model';
import { Activity } from '../../../models/activity.model';
import { ServiceService } from '../../../services/service.service';
import { ActivityService } from '../../../services/activity.service';
import { Indicator } from '../../../models/indicator.model';
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
  styleUrl: './create-indicator-form.component.scss'
})
export class CreateIndicatorFormComponent implements OnInit {
  isModalVisible = false;
  services: Service[] = [];
  activities: Activity[] = [];
  indicator: Indicator = {
    id: null,
    indicator_name: '',
    service_id: null,
    activity_id: null,
    type: '',
    target_value: null,
    year: new Date().getFullYear()
  };

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  isLoading = false;

  constructor(private indicatorService: IndicatorService, private serviceService: ServiceService, private activityService: ActivityService) { }

  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
  }
  closeModal() {
    this.isModalVisible = false;
  }
  ngOnInit() {
    this.fetchServices();
    this.fetchActivities();
  }

  fetchServices() {
    this.serviceService.getServices().subscribe(data => {
      this.services = data;
    });
  }

  fetchActivities() {
    this.activityService.getActivities().subscribe(data => {
      this.activities = data;
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
      id: null,
      indicator_name: '',
      service_id: null,
      activity_id: null,
      type: '',
      target_value: null,
      year: new Date().getFullYear()
    };
  }

}
