import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';
import {ActivityService} from '../../../services/activity.service'

@Component({
  selector: 'app-activities-list-section',
  standalone: true,
  imports: [CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './activities-list-section.component.html',
  styleUrl: './activities-list-section.component.scss'
})
export class ActivitiesListSectionComponent implements OnInit, OnChanges {
  isError: boolean = false;
  isModalOpen: boolean = false;
  modalAction: string = ""
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

  openModal(actionType: string){
    this.isModalOpen = true;
    this.modalAction = actionType;
  }
  closeModal(){
    this.isModalOpen = false;
  }
  
  formSubmited(){
    if(this.modalAction === "create"){
      this.createActivity();
    } 
    else if ( this.modalAction === "edit"){
      this.editActivity();
    }
    else if ( this.modalAction === "delete"){
      //this.removeActivity();
    }
  }

  editActivity(){

  }

  createActivity(){

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
}
