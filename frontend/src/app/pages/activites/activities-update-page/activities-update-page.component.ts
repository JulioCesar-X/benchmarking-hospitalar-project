import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ActivitiesUpsertFormComponent } from '../../../components/activities/activities-upsert-form/activities-upsert-form.component';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoggingService } from '../../../core/services/logging.service';

@Component({
  selector: 'app-activities-update-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuComponent,
    ActivitiesUpsertFormComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './activities-update-page.component.html',
  styleUrls: ['./activities-update-page.component.scss']
})
export class ActivitiesUpdatePageComponent implements OnInit, OnDestroy {
  selectedActivity: Activity = { id: -1, activity_name: '' };
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private loggingService: LoggingService
  ) { }


  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const activityId = +params['id'];
      if (activityId) {
        this.loadActivity(activityId);
      }
    });
    localStorage.removeItem('activeLink');

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadActivity(activityId: number): void {
    this.isLoading = true;
    this.activityService.showActivity(activityId).subscribe({
      next: (data) => {
        this.selectedActivity = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.loggingService.error('Error loading activity', error);
        this.isLoading = false;
      }
    });
  }
}