import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild } from '@angular/core';
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
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

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
    MatTooltipModule,
    MatSortModule
  ]
})
export class ActivitiesListSectionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() activities: Activity[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;
  dataSource: MatTableDataSource<Activity> = new MatTableDataSource<Activity>([]);
  sortedActivities: Activity[] = [];

  @ViewChild(MatSort) sort!: MatSort;

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
      this.sortedActivities = this.activities.slice();
      this.dataSource.data = this.sortedActivities;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities'] && !changes['activities'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.activities.length;
      this.sortedActivities = this.activities.slice();
      this.dataSource.data = this.sortedActivities;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadActivities(pageIndex = 0, pageSize = 10): void {
    this.isLoading = true;
    this.activityService.getActivitiesPaginated(pageIndex + 1, pageSize).subscribe({
      next: (data) => {
        this.activities = data.data;
        this.totalLength = data.total;
        this.currentPage = pageIndex;
        this.isLoading = false;
        this.sortedActivities = this.activities.slice();
        this.dataSource.data = this.sortedActivities;
      },
      error: (error) => {
        console.error("Error loading paginated activities:", error);
        this.isLoading = false;
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
          this.deleteActivity(activity.id ? activity.id : 0);
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
        this.loadActivities(this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.error("Error deleting activity:", error);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadActivities(this.currentPage, this.pageSize);
  }

  sortData(sort: Sort) {
    const data = this.activities.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedActivities = data;
      this.dataSource.data = this.sortedActivities;
      return;
    }

    this.sortedActivities = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'activity_name':
          return this.compare(a.activity_name.toLowerCase(), b.activity_name.toLowerCase(), isAsc);
        default:
          return 0;
      }
    });

    this.dataSource.data = this.sortedActivities;
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}