import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../../../components/shared/menu/menu.component';
import { ActivitiesUpsertFormComponent } from '../../../components/activities/activities-upsert-form/activities-upsert-form.component';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Activity } from '../../../core/models/activity.model';
import { LoadingSpinnerComponent } from '../../../components/shared/loading-spinner/loading-spinner.component';

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
export class ActivitiesUpdatePageComponent implements OnInit {
  selectedActivity: Activity = { id: -1, activity_name: '' };
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const activityId = params['id'];
      if (activityId) {
        this.loadActivity(activityId);
      }
    });
  }

  loadActivity(activityId: number): void {
    this.isLoading = true;
    this.activityService.showActivity(activityId).subscribe({
      next: (data) => {
        this.selectedActivity = data;
        this.isLoading = false; // <-- Will be updated once data is fully loaded
      },
      error: (error) => {
        console.error('Error loading activity', error);
        this.isLoading = false;
      }
    });
  }
}
