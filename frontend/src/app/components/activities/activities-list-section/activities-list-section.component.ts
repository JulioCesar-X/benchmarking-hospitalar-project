import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectableListComponent } from '../../shared/selectable-list/selectable-list.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { Activity } from '../../../core/models/activity.model';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-activities-list-section',
  templateUrl: './activities-list-section.component.html',
  styleUrls: ['./activities-list-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    LoadingSpinnerComponent,
    PaginatorComponent,
    SelectableListComponent,
    DialogContentComponent,
    MatTooltipModule
  ]
})
export class ActivitiesListSectionComponent implements OnInit, OnChanges {
  @Input() activities: Activity[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20];
  currentPage = 0;
  totalLength = 0;

  constructor(
    private activityService: ActivityService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.activities.length) {
      this.loadActivities();
    } else {
      this.isLoading = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities'] && !changes['activities'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.activities.length;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadActivities(pageIndex = 0, pageSize = 10): void {
    this.isLoading = true;
    this.activityService.getActivitiesPaginated(pageIndex, pageSize).subscribe({
      next: (data) => {
        console.log("Activities Data Received:", data);
        this.activities = data.data;
        this.totalLength = data.total;
        this.currentPage = pageIndex;
        this.isLoading = false;
        console.log("Total length:", this.totalLength);
        console.log("Activities list:", this.activities);
      },
      error: (error) => {
        console.error("Error loading paginated activities:", error);
        this.isLoading = false;
      },
      complete: () => {
        console.log("Activity loading complete.");
      }
    });
  }

  openDialog(activity: Activity | null, action: string): void {
    if (action === 'delete' && activity) {
      const dialogRef = this.dialog.open(DialogContentComponent, {
        data: {
          message: `Tem a certeza que quer remover a atividade ${activity.activity_name}?`,
          loadingMessage: 'Removendo atividade...'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteActivity(activity.id);
        }
      });
    } else if (action === 'edit' && activity) {
      this.router.navigate([`/activities/update/${activity.id}`]);
    } else if (action === 'create') {
      this.router.navigate(['/activities/create']);
    }
  }

  deleteActivity(activityId: number): void {
    this.activityService.destroyActivity(activityId).subscribe({
      next: (data) => {
        console.log("Activity deleted:", data);
        this.loadActivities(this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.error("Error deleting activity:", error);
      },
      complete: () => {
        console.log("Activity deletion complete.");
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadActivities(this.currentPage, this.pageSize);
  }
}
