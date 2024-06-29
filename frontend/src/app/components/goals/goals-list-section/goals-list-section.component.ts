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

@Component({
  selector: 'app-goals-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorComponent,
    LoadingSpinnerComponent
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
  goals: any[] = [];
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

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
      console.log('serviceId >>', serviceId);
      console.log('activityId >>', activityId);
      console.log('year >>', year);
      console.log('currentPage >>', this.currentPage);
      console.log('pageSize >>', this.pageSize);
      this.indicatorService.getIndicatorsGoals(serviceId, activityId, year, this.currentPage, this.pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching goals', error);
            return of([]);
          }),
          finalize(() => this.isLoadingGoals = false)
        )
        .subscribe(response => {
          console.log('goals >>', response);
          this.totalGoals = response.total;
          this.goals = response.data.map((item: any) => ({
            id: item.goal.goal_id,
            indicator_name: item.indicator_name,
            target_value: item.goal.target_value,
            year: item.goal.year,
            isInserted: item.goal.target_value !== '0',
            isUpdating: false
          }));
        });
    }
  }

  editGoal(goal: any): void {
    if (goal.isInserted) {
      goal.isInserted = false;
    } else {
      goal.isUpdating = true;
      this.goalService.updateGoal(goal.id, goal)
        .pipe(finalize(() => goal.isUpdating = false))
        .subscribe(
          () => this.setNotification('Meta atualizada com sucesso', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    }
  }

  onValueChange(goal: any): void {
    const index = this.goals.findIndex(r => r.id === goal.id);
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
        return 'User already exists';
      case 400:
        return 'Invalid email';
      default:
        return 'An error occurred. Please try again later.';
    }
  }

  handlePageEvent(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadGoals();
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }
}