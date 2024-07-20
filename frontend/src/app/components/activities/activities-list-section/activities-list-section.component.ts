import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { MatDialogModule } from '@angular/material/dialog';
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
  allActivities: Activity[] = [];
  loadedPages: Set<number> = new Set();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private activityService: ActivityService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.activities.length) {
      this.loadActivities(0, 30);
    } else {
      this.isLoading = false;
      this.allActivities = this.activities.slice();
      this.updateDataSource();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activities'] && !changes['activities'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.activities.length;
      this.allActivities = this.activities.slice();
      this.updateDataSource();
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadActivities(pageIndex = 0, pageSize = 30): void {
    this.isLoading = true;
    this.activityService.getActivitiesPaginated(pageIndex + 1, pageSize).subscribe({
      next: (data) => {
        if (pageIndex === 0) {
          this.allActivities = data.data;
        } else {
          this.allActivities = [...this.allActivities, ...data.data];
        }
        this.totalLength = data.total;
        this.updateDataSource();
        this.loadedPages.add(pageIndex);
        this.isLoading = false;
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
      next: () => {
        this.allActivities = this.allActivities.filter(activity => activity.id !== activityId);
        this.updateDataSource();
      },
      error: (error) => {
        console.error("Error deleting activity:", error);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (!this.loadedPages.has(this.currentPage)) {
      this.loadActivities(this.currentPage, this.pageSize * 3);
    } else {
      this.dataSource.data = this.allActivities.slice(startIndex, endIndex);
    }
  }

  sortData(sort: Sort) {
    const data = this.allActivities.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'activity_name':
          return this.compare(a.activity_name, b.activity_name, isAsc);
        default:
          return 0;
      }
    }).slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' }) * (isAsc ? 1 : -1);
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource = new MatTableDataSource(this.allActivities.slice(startIndex, endIndex));
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}