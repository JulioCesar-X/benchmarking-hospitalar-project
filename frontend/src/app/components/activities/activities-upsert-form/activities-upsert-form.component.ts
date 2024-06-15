import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';
import {ServiceService} from '../../../services/service.service'
import {ActivityService} from '../../../services/activity.service'
import {IndicatorService} from '../../../services/indicator.service'
import { NotificationComponent } from '../../shared/notification/notification.component';

@Component({
  selector: 'app-activities-upsert-form',
  standalone: true,
  imports: [CommonModule,
    MatPaginatorModule,
    FormsModule,
    NotificationComponent],
  templateUrl: './activities-upsert-form.component.html',
  styleUrl: './activities-upsert-form.component.scss'
})
export class ActivitiesUpsertFormComponent implements OnInit {

    @Input({required: true})formsAction: string = "";

    notificationMessage: string = '';
    notificationType: 'success' | 'error' = 'success';

    selectedActivity:any = "";

    isLoadingServices: boolean = true;
    isLoadingIndicadores: boolean = true; 
    isError: boolean = false;

    servicesList: any = [];
    indicatorsList: any = [];
    selectedIndicatorsIDs: any = [];

  constructor(private router: Router,
    private serviceService:ServiceService,
    private activityService:ActivityService,
    private indicatorService:IndicatorService) { }

    ngOnInit(): void {
      this.getServices();
      this.getIndicators();

      if(this.formsAction === "edit"){
        this.activityService.activityData$.subscribe(data => {
          this.selectedActivity = data;
        });
      }


      console.log(this.selectedActivity)
    }
    
  getServices(){
    this.isLoadingServices = true;

    this.serviceService.getServices().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { 
          this.servicesList = data.map(service => ({
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

  getIndicators(){
    this.isLoadingIndicadores = true;

    this.indicatorService.getIndicators().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { 
          this.indicatorsList = data.map(indicator => ({
            id: indicator.id,
            indicator_name: indicator.indicator_name
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {      
        console.error('Erro ao obter Indicadores', error);
      },
      complete:() => {
   
        this.isLoadingIndicadores = false;
      }
    });
  }


  formSubmited(){

    if(this.formsAction === "create"){
      this.createActivity();
    } 
    else if ( this.formsAction === "edit"){
      this.editActivity();
    }
    else {
      //navigate to a not found page
    }
  }



  editActivity(){

    console.log("EDITED", this.selectedActivity)

    const updatedActivity = {
      activity_name: this.selectedActivity.name,
    }

    this.activityService.updateActivity(this.selectedActivity.id, updatedActivity).subscribe(
      (response: any) => {
          this.setNotification('Atividade criada com sucesso', 'success');
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
      }
  ); 
  }



  createActivity(){

    const createdActivity = {
      activity_name: this.selectedActivity,
    }

    this.activityService.createActivity(createdActivity).subscribe(
      (response: any) => {
          this.setNotification('Atividade criada com sucesso', 'success');
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

  //Estes metodos gerem os Ids das atividades na lista de acordo com checkboxs selecionadas!
  toggleSelection(activityId: number) {
    const index = this.selectedIndicatorsIDs.indexOf(activityId);
    if (index > -1) {
      this.selectedIndicatorsIDs.splice(index, 1);
    } else {
      this.selectedIndicatorsIDs.push(activityId);
    }
  }
  isSelected(activityId: number): boolean {
    return this.selectedIndicatorsIDs.includes(activityId);
  }
}
