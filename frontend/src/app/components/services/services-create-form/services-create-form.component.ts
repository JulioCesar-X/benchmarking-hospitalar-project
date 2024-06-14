import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../shared/notification/notification.component';
import { HttpClient } from '@angular/common/http';
import { ActivityService } from '../../../services/activity.service'

@Component({
  selector: 'app-services-create-form',
  standalone: true,
  imports: [        
    CommonModule,
    FormsModule,
    NotificationComponent ],
  templateUrl: './services-create-form.component.html',
  styleUrl: './services-create-form.component.scss'
})
export class ServicesCreateFormComponent {
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  activitiesList: any = [];

  nomeServico: string = "";
  descrição: string = "";
  selectedFile: File | null = null;
  selectedActivityIds: number[] = [];

  isLoading = true; 

  constructor(private http: HttpClient, private activityService:ActivityService) {}

  ngOnInit(): void {
    this.getActivities();
   }

  onSubmit(): void {
    //criar serviço
    //fazer associações de serviço criado - criar novos records
  }

  createService(){
    //colocar logica para criar Service

    //---ESTA PARTE DEVERA SER FEITA EM BACKEND? - SO TENS O ID DO NOVO SERVICO DPS DE O CRIAR!
/*     colocar logica para iterar sobre cada item da lista selectedActivityIds e criar/verificar se existem
    records na tabela SAI */ 
  }

  trackByIndex(index: number, item: string): number {
    return index;
  }


  getActivities(): void {
    this.isLoading = true;
  
    this.activityService.getActivities().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.activitiesList = data.map(activity => ({
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
        this.isLoading = false;
      }
    });
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
}
