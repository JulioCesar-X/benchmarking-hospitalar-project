import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Indicator } from '../../../models/indicator.model';
import {GoalService} from '../../../services/goal.service'
import { IndicatorService } from '../../../services/indicator.service'

import { Filter } from '../../../models/Filter.model';

@Component({
  selector: 'app-goals-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './goals-list-section.component.html',
  styleUrls: ['./goals-list-section.component.scss']
})
export class GoalsListSectionComponent implements OnInit, OnChanges {
  @Input() filter: Filter | undefined;
  @Input() indicators: Indicator[] = [];
  @Input() isLoading: boolean = false; // Adiciona a propriedade isLoading
  indicatorForms: { [key: number]: FormGroup } = {};

  isLoadingGoals: boolean = true;
  totalGoals: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  goals: any[] = [];

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, 
    private router: Router,
    private goalService: GoalService,
    private indicatorService: IndicatorService
  ) { }


  ngOnInit(): void {

    this.GetGoals();
    console.log(this.goals);
  }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
        console.log('Filter changed:', this.filter);
        this.GetGoals();
      }
    }


    GetGoals(){

      if(this.filter && this.filter.year && this.filter.month && this.filter.serviceId && this.filter.activityId){
        this.isLoadingGoals = true;
        let serviceID = parseInt(this.filter.serviceId);
        let activityId = parseInt(this.filter.activityId);


        //API request to filter goals using seviceID, activiyID and year
        this.indicatorService.getAllSaiGoals(serviceID, activityId, this.filter.year).subscribe({
          next: (data) => {
            if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
              console.log(data);
      
              //REVER ISTO E PARTE DE UPDATE
              this.goals = data.map(item => {
                if (item.goal && item.goal !== undefined) {
                  return {
                    id: item.goal.goal_id, 
                    indicatorName: item.indicator_name,
                    target_value: item.goal.target_value,
                    year: item.goal.year,
                    isInserted: item.goal.target_value === '0' ? false : true,
                    isUpdating: false
                  };
                } else {
                  return null; // or {} if you want to return an empty object instead
                }
              }).filter(item => item !== null); 
      
              console.log(this.goals);
      
            } else {
              console.warn('Data is not an array:', data);
              this.isLoadingGoals = false;
            }
          },
          error: (error) => {      
            console.error('Erro ao obter Indicadores', error);
            this.isLoadingGoals = false;
          },
          complete:() => {
            this.isLoadingGoals = false;
          }
        });
      }
    }



    UpdateGoal(goalUpdate: any): void {
      //colocar if statement para verificar se o botao esta no estado atualizar ou editar!!!
      //TESTAR PARA VER SE ATUALIZA NA DB

      if(goalUpdate.isInserted){
        goalUpdate.isInserted = false;
      } else {
  
        goalUpdate.isUpdating = true;
        goalUpdate.isInserted = true;
        //logica de dar update aqui
        this.goalService.editGoal(goalUpdate.id, goalUpdate).subscribe(
          (response: any) => {
  
            //usar mesmo notificacoes
            goalUpdate.isUpdating = false;
              this.setNotification('Meta atualizada com sucesso', 'success');


              alert('updated')
              console.log("goalUpdate", goalUpdate)
              console.log("response",response)
          },
          (error: any) => {
            console.log(error)
              goalUpdate.isUpdating = false;
              const errorMessage = this.getErrorMessage(error);
              this.setNotification(errorMessage, 'error');
          }
      ); 
      }
  
        }


    onValueChange(goal: any): void {
      // Assuming you want to immediately update the goal in the local list
      const index = this.goals.findIndex(r => r.id === goal.id);
  
      // Update the value in the local goals array
      this.goals[index].value = goal.value;
      console.log(this.goals[index].value);
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

  toggleEdit(indicator: Indicator): void {
    indicator.isInserted = !indicator.isInserted;
    const formControl = this.indicatorForms[indicator.sai_id!].get('indicatorValue');
    if (formControl) {
      if (indicator.isInserted) {
        formControl.disable();
      } else {
        formControl.enable();
      }
    }
  }

  trackByIndex(index: number, item: Indicator): number {
    return item.sai_id!;
  }
}
