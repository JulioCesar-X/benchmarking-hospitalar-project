import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() indicators: any[] = [];
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
    if (this.filter?.year && this.filter?.month && this.filter?.serviceId) {
      this.isLoadingRecords = true;
      const year = this.filter.year;
      const month = this.filter.month;
      const serviceId = Number(this.filter.serviceId);
      const activityId = this.filter.activityId !== null && this.filter.activityId !== undefined ? Number(this.filter.activityId) : null;

      this.indicatorService.getIndicatorsRecords(serviceId, activityId, year, month, this.currentPage, this.pageSize)
        .pipe(
          catchError(error => {
            console.error('Error fetching records', error);
            return of([]);
          }),
          finalize(() => this.isLoadingRecords = false)
        )
        .subscribe(response => {
          console.log('records >>', response);
          this.totalRecords = response.total;
          this.records = response.data.flatMap((item: any) => item.records.map((record: any) => ({
            record_id: record.record_id,
            indicator_name: item.indicator_name,
            saiId: item.sai_id,
            value: record.value,
            date: record.date,
            isInserted: record.value !== '0',
            isUpdating: false
          })));
        });
    }
  }

  editRecord(record: any): void {
    if (record.isInserted) {
      record.isInserted = false;
    } else {
      record.isUpdating = true;
      this.recordService.updateRecord(record.record_id, record)
        .pipe(finalize(() => record.isUpdating = false))
        .subscribe(
          () => this.setNotification('Registro atualizado com sucesso', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    }
  }

  onValueChange(record: any): void {
    const index = this.records.findIndex(r => r.id === record.id);
    if (index !== -1) {
      this.records[index].value = record.value;
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