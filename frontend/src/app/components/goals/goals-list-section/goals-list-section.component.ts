import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Indicator } from '../../../models/indicator.model';
import {GoalService} from '../../../services/goal.service'
import { Goal } from '../../../models/Goal.model';
@Component({
  selector: 'app-goals-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './goals-list-section.component.html',
  styleUrls: ['./goals-list-section.component.scss']
})
export class GoalsListSectionComponent implements OnInit, OnChanges {
  @Input() indicators: Indicator[] = [];
  @Input() isLoading: boolean = false; // Adiciona a propriedade isLoading
  indicatorForms: { [key: number]: FormGroup } = {};

  isLoadingGoals: boolean = true;
  totalGoals: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  goals: any[] = [];

  constructor(private fb: FormBuilder, 
    private router: Router,
    private goalService: GoalService
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.GetRecords();
    console.log(this.goals);
  }

GetRecords(){
  this.isLoadingGoals = true;

  this.goalService.getRecords().subscribe({
    next: (data) => {
      if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
        console.log(data);

        this.goals = data.map(record => ({
          id: record.id,
          saiId: record.service_activity_indicator_id,
          value: record.value,
          date: record.date,
        }));

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


  //adaptar nomes indicators para goals abaixo?? confirmar!
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicators']) {
      if (changes['indicators'].currentValue !== changes['indicators'].previousValue) {
        this.buildForm();
      }
    }
  }

  buildForm(): void {
    this.indicatorForms = {};
    this.indicators.forEach(indicator => {
      this.indicatorForms[indicator.sai_id!] = this.fb.group({
        indicatorValue: new FormControl(indicator.goal?.target_value || '', Validators.required)
      });
      indicator.isInserted = indicator.goal?.target_value != null;
    });
  }

  onValueChange(indicator: Indicator, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    indicator.goal!.target_value = inputElement.value;
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
