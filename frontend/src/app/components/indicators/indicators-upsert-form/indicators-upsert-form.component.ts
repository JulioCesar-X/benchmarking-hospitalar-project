import { Component, OnInit, Input } from '@angular/core';
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
  selector: 'app-indicators-upsert-form',
  standalone: true,
  imports: [    CreateFieldModalComponent,
    CommonModule,
    FormsModule,
    NotificationComponent],
  templateUrl: './indicators-upsert-form.component.html',
  styleUrl: './indicators-upsert-form.component.scss'
})
export class IndicatorsUpsertFormComponent {

  @Input({required: true})formsAction: string = "";

  isModalVisible: boolean = false;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  selectedIndicator:any = "";

  isLoadingServices: boolean = true;
  isLoadingAtividades: boolean = true; 
  isError: boolean = false;

  services: any[] = [];
  activities: any[] = [];

  goalTargetValue: string = "";

  constructor(
    private indicatorService: IndicatorService,
    private serviceService: ServiceService,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    this.getServices();
    this.getActivities();

    if(this.formsAction === "edit"){
      this.indicatorService.indicatorData$.subscribe(data => {
        this.selectedIndicator = data;
        console.log(this.selectedIndicator)
      });
    }
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

  formSubmited(){

    if(this.formsAction === "create"){
      this.createIndicator();
    } 
    else if ( this.formsAction === "edit"){
      this.editIndicator();
    }
    else {
      //navigate to a not found page
    }
  }

  createIndicator(){

    const createdIndicator = {
      indicator_name: this.selectedIndicator,
    }

    this.indicatorService.postIndicator(createdIndicator).subscribe(
      (response: any) => {
          this.setNotification('Indicador criado com sucesso', 'success');
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
      }
  );
  }
  
  editIndicator(){
    console.log("EDITED", this.selectedIndicator)

    const updatedIndicator = {
      indicator_name: this.selectedIndicator.name,
    }

    this.indicatorService.editIndicator(this.selectedIndicator.id, updatedIndicator).subscribe(
      (response: any) => {
          this.setNotification('Indicador editado com sucesso', 'success');
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
      }
  ); 
  }


  trackByIndex(index: number, item: any): number {
    return item.id;
  }
  
  setNotification(message: string, type: 'success' | 'error') {
    this.notificationMessage = message;
    this.notificationType = type;
}

getErrorMessage(error: any): string {
    if (error.status === 409) {
        return 'User already exists';
    }
    if (error.status === 400) {
        return 'Invalid email';
    }
    return 'An error occurred. Please try again later.';
}

openModal(event: Event) {
  event.preventDefault();
  this.isModalVisible = true;
}

closeModal() {
  this.isModalVisible = false;
}
}
