import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { HttpClient } from '@angular/common/http';
import { ActivityService } from '../../../services/activity.service'
import { ServiceService } from '../../../services/service.service'

@Component({
  selector: 'app-service-upsert-form',
  standalone: true,
  imports: [    CommonModule,
    FormsModule,
    NotificationComponent ],
  templateUrl: './service-upsert-form.component.html',
  styleUrl: './service-upsert-form.component.scss'
})
export class ServiceUpsertFormComponent {
  @Input({required: true})formsAction: string = "";

  isModalVisible: boolean = false;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  selectedService:any = "";

  isLoadingAtivities: boolean = true; 
  isError: boolean = false;

  activities: any = [];
  selectedActivityIds: any = [];

  constructor(
    private serviceService: ServiceService,
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {
    this.getActivities();

    if(this.formsAction === "edit"){
      this.serviceService.serviceData$.subscribe(data => {
        this.selectedService = data;
        console.log(data)
      });
    }
   }

   getActivities(): void {
    this.isLoadingAtivities = true;
  
    this.activityService.getActivities().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.activities = data.map(activity => ({
            id: activity.id,
            activity_name: activity.activity_name
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error: any) => {
        console.error('Erro ao obter atividades', error);
      },
      complete: () => {
        this.isLoadingAtivities = false;
      }
    });
  }

  formSubmited(){

    if(this.formsAction === "create"){
      this.createService();
    } 
    else if ( this.formsAction === "edit"){
      this.editService();
    }
    else {
      //navigate to a not found page
    }
  }


  createService(){
    //criar serviço
    //fazer associações de serviço criado - criar novos records

    //---ESTA PARTE DEVERA SER FEITA EM BACKEND? - SO TENS O ID DO NOVO SERVICO DPS DE O CRIAR!
/*     colocar logica para iterar sobre cada item da lista selectedActivityIds e criar/verificar se existem
    records na tabela SAI */ 
    const updatedService = {
      service_name: this.selectedService,
    }

    this.serviceService.createService(updatedService).subscribe(
      (response: any) => {
          this.setNotification('Serviço criado com sucesso', 'success');
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
      }
  );
  }

  editService(){
    console.log("EDITED", this.selectedService)
    //tem de estar igual ao que esta na DB
    const updatedService = {
      service_name: this.selectedService.name,
      description: this.selectedService.description,
      imageUrl: this.selectedService.imageUrl
    }

    this.serviceService.editService(this.selectedService.id, updatedService).subscribe(
      (response: any) => {
          this.setNotification('Serviço editado com sucesso', 'success');
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
      }
    ); 
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

  trackByIndex(index: number, item: string): number {
    return index;
  }



  
  //Estes metodos gerem os Ids das atividades na lista de acordo com checkboxs selecionadas!
  toggleSelection(activityId: number) {
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

  //Este metodos gerem a customizaçao do input do tipo file
  fileName: string = 'Ficheiro não escolhido';
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.fileName = input.files[0].name;
    } else {
      this.fileName = 'Ficheiro não escolhido';
    }
  }


  openModal(event: Event) {
    event.preventDefault();
    this.isModalVisible = true;
  }
  
  closeModal() {
    this.isModalVisible = false;
  }
}
