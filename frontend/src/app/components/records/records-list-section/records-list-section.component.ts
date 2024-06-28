import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Filter } from '../../../core/models/filter.model';
import { RecordService } from '../../../core/services/record/record.service';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-records-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './records-list-section.component.html',
  styleUrls: ['./records-list-section.component.scss']
})
export class RecordsListSectionComponent implements OnInit, OnChanges {
  @Input() filter: Filter | undefined;
  @Input() indicators: any[] = []; // Add this line to define the 'indicators' input
  @Input() isLoading: boolean = false;

  isLoadingRecords = true;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  records: any[] = [];
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private recordService: RecordService,
    private indicatorService: IndicatorService
  ) { }

  ngOnInit(): void {
    this.loadRecords();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      this.loadRecords();
    }
  }

  loadRecords(): void {
    if (this.filter?.year && this.filter?.month && this.filter?.serviceId && this.filter?.activityId) {
      this.isLoadingRecords = true;
      const date = new Date(Number(this.filter.year), Number(this.filter.month) - 1);
      const dateStr = date.toISOString().split('T')[0];
      const serviceId = Number(this.filter.serviceId);
      const activityId = Number(this.filter.activityId);

      this.indicatorService.getIndicatorsRecords(serviceId, activityId, dateStr, this.currentPage, this.pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching records', error);
            return of([]);
          }),
          finalize(() => this.isLoadingRecords = false)
        )
        .subscribe(data => {
          this.records = data.filter((item: any) => item.records && item.records[0]).map((item: any) => ({
            id: item.records[0].record_id,
            indicator_name: item.indicator_name,
            saiId: item.sai_id,
            value: item.records[0].value,
            isInserted: item.records[0].value !== '0',
            isUpdating: false
          }));
        });
    }
  }
  onValueChange(record: any): void {
    const index = this.records.findIndex(r => r.id === record.id);
    if (index !== -1) {
      this.records[index].value = record.value;
    }
  }

  editRecord(recordUpdate: any): void {
    if (recordUpdate.isInserted) {
      recordUpdate.isInserted = false;
    } else {
      recordUpdate.isUpdating = true;
      this.recordService.updateRecord(recordUpdate.id, recordUpdate)
        .pipe(finalize(() => recordUpdate.isUpdating = false))
        .subscribe(
          () => this.setNotification('Record updated successfully', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    }
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    switch (error.status) {
      case 409:
        return 'Record already exists';
      case 400:
        return 'Invalid data';
      default:
        return 'An error occurred. Please try again later.';
    }
  }

  handlePageEvent(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRecords();
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }
}
