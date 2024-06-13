import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';
import {ActivityService} from '../../../services/activity.service'

@Component({
  selector: 'app-activities-list-section',
  standalone: true,
  imports: [CommonModule,
    MatPaginatorModule,
    FormsModule
  ],
  templateUrl: './activities-list-section.component.html',
  styleUrl: './activities-list-section.component.scss'
})
export class ActivitiesListSectionComponent implements OnInit, OnChanges {
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  isError: boolean = false;
  isModalOpen: boolean = false;
  modalAction: string = ""
  selectedActivity: any | undefined;

  isLoading: boolean = false;
  totalActivities: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  @Input() activities: any[] = [];

  constructor(private router: Router, private activityService:ActivityService) { }

  ngOnInit(): void {
    this.getActivities();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  getActivities(){
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
      }
    });
  }

  openModal(actionType: string, activity: any = ""){
    this.selectedActivity = activity != "" ? activity.activity_name : "";
    
    this.modalAction = actionType; //edit, create or delete
    setTimeout(() => {
      this.isModalOpen = true;
  }, 1);

    console.log(this.selectedActivity)
    console.log(activity)
  }

  closeModal(){
    this.isModalOpen = false;
    this.selectedActivity = "";
  }

  formSubmited(){
    console.log("submited", this.modalAction)
    if(this.modalAction === "create"){
      this.createActivity();
    } 
    else if ( this.modalAction === "edit"){
      this.editActivity();
    }
    else if ( this.modalAction === "delete"){
      this.removeActivity(this.selectedActivity);
    }
  }



  editActivity(){
    this.isLoading = true;

    console.log("EDITED", this.selectedActivity)

    const updatedActivity = {
      activity_name: this.selectedActivity.name,
    }

    this.activityService.updateActivity(this.selectedActivity.id, updatedActivity).subscribe(
      (response: any) => {
          this.setNotification('Atividade criada com sucesso', 'success');
          this.isLoading = false; // Define isLoading como falso após a conclusão do envio
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
          this.isLoading = false; // Define isLoading como falso em caso de erro
      }
  );
    
  }

 /*  createUser() {
     // Define isLoading como verdadeiro ao enviar o formulário

    if (this.role_id === null) {
        this.setNotification('Role ID is required', 'error');
        this.isLoading = false; // Define isLoading como falso em caso de erro
        return;
    }

    const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        role_id: this.role_id,
    };

    this.userService.createUser(userData).subscribe(
        (response: any) => {
            this.setNotification('User created successfully', 'success');
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

 */



  createActivity(){
 this.isLoading = true;

    console.log("Created", this.selectedActivity)

    const createdActivity = {
      activity_name: this.selectedActivity,
    }



    this.activityService.createActivity(createdActivity).subscribe(
      (response: any) => {
          this.setNotification('Atividade criada com sucesso', 'success');
          this.isLoading = false; // Define isLoading como falso após a conclusão do envio
      },
      (error: any) => {
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
          this.isLoading = false; // Define isLoading como falso em caso de erro
      }
  );
  }

  removeActivity(id: any){
    //abrir modal para remover user
    //remover da lista local e da DB
  }


  trackByIndex(index: number, item: any): number {
    return item.id;
  }

/*   navigateToEditIndicator(indicatorID: any){
    this.router.navigate([`indicatorsEdit/${indicatorID}`]);
  }

  navigateToCreateIndicator() {
    this.router.navigate(['createIndicators']);
  } */
  
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
   /*  this.loadIndicators();  */ // Carrega os usuários com a página e tamanho de página atualizados
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

}
