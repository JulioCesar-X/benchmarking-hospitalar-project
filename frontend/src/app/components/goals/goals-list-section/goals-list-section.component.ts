import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Filter } from '../../../core/models/filter.model';
import { GoalService } from '../../../core/services/goal/goal.service';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { PageEvent } from '@angular/material/paginator';

interface Goal {
  id: number | null;
  indicator_name: string;
  target_value: string;
  year: number;
  sai_id: number | null;
  isInserted: boolean;
  isUpdating: boolean;
  isEditing: boolean;
}

@Component({
  selector: 'app-goals-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorComponent,
    LoadingSpinnerComponent,
    FeedbackComponent
  ],
  templateUrl: './goals-list-section.component.html',
  styleUrls: ['./goals-list-section.component.scss']
})
export class GoalsListSectionComponent implements OnInit, OnChanges {
  @Input() filter: Filter | undefined;
  @Input() indicators: any[] = [];
  @Input() isLoading: boolean = false;

  isLoadingGoals = true;
  totalGoals = 0;
  pageSize = 10;
  currentPage = 0;
  goals: Goal[] = [];
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  pageOptions = [5, 10, 20, 50, 100]; // Define the pageOptions array here

  constructor(
    private goalService: GoalService,
    private indicatorService: IndicatorService
  ) { }

  ngOnInit(): void {
    this.loadGoals();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      this.loadGoals();
    }
  }

  loadGoals(): void {
    if (this.filter?.year && this.filter?.serviceId) {
      this.isLoadingGoals = true;
      const serviceId = Number(this.filter.serviceId);
      const activityId = this.filter.activityId !== null && this.filter.activityId !== undefined ? Number(this.filter.activityId) : null;
      const year = this.filter.year;

      this.indicatorService.getIndicatorsGoals(serviceId, activityId, year, this.currentPage, this.pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching goals', error);
            return of({ total: 0, data: [] });
          }),
          finalize(() => this.isLoadingGoals = false)
        )
        .subscribe(response => {
          this.totalGoals = response.total;
          this.goals = response.data.map((item: any) => {
            const goal = item.goal || {
              goal_id: null,
              target_value: '',
              year: year
            };

            return {
              id: goal.goal_id,
              indicator_name: item.indicator_name,
              target_value: goal.target_value,
              year: goal.year,
              sai_id: item.sai_id,
              isInserted: goal.target_value !== '',
              isUpdating: false,
              isEditing: false
            };
          });
          console.log('Goals loaded:', this.goals);
        });
    }
  }

  editGoal(goal: Goal): void {
    if (goal.isInserted && !goal.isEditing) {
      goal.isEditing = true;
      return;
    }

    if (String(goal.target_value).trim() === '') {
      this.setNotification('O valor não pode estar vazio', 'error');
      return;
    }

    const valueAsNumber = Number(goal.target_value);
    if (isNaN(valueAsNumber) || !Number.isInteger(valueAsNumber) || valueAsNumber <= 0) {
      this.setNotification('O valor deve ser um número inteiro maior que 0', 'error');
      return;
    }

    if (goal.id) {
      goal.isUpdating = true;
      this.goalService.updateGoal(goal.id, goal)
        .pipe(finalize(() => {
          goal.isUpdating = false;
          goal.isEditing = false;
        }))
        .subscribe(
          () => this.setNotification('Meta atualizada com sucesso', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    } else {
      const newGoal = {
        sai_id: goal.sai_id,
        target_value: goal.target_value,
        year: goal.year
      };
      goal.isUpdating = true;
      this.storeGoal(newGoal);
    }
  }

  storeGoal(newGoal: any): void {
    this.goalService.storeGoal(newGoal)
      .pipe(finalize(() => newGoal.isUpdating = false))
      .subscribe(
        () => {
          this.setNotification('Meta criada com sucesso', 'success');
          this.loadGoals();
        },
        error => this.setNotification(this.getErrorMessage(error), 'error')
      );
  }

  onValueChange(goal: Goal): void {
    const index = this.goals.findIndex(g => g.id === goal.id);
    if (index !== -1) {
      this.goals[index].target_value = goal.target_value;
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    switch (error.status) {
      case 409:
        return 'Goal already exists';
      case 400:
        return 'Invalid data';
      default:
        return 'An error occurred. Please try again later.';
    }
  }

  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadGoals();
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }
}