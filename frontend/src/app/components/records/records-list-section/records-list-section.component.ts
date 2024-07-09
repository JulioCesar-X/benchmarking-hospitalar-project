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
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Record {
  record_id: number | null;
  indicator_name: string;
  saiId: number;
  value: string;
  date: string;
  isInserted: boolean;
  isUpdating: boolean;
  isEditing: boolean;
}

@Component({
  selector: 'app-records-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorComponent,
    LoadingSpinnerComponent,
    FeedbackComponent,
    MatTooltipModule
  ],
  templateUrl: './records-list-section.component.html',
  styleUrls: ['./records-list-section.component.scss']
})
export class RecordsListSectionComponent implements OnInit, OnChanges {
  @Input() filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };



  @Input() indicators: any[] = [];
  @Input() isLoading: boolean = false;

  isLoadingRecords = true;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 0;
  records: Record[] = [];
  notificationMessage = '';
  notificationType: 'success' | 'error' = 'success';
  pageOptions = [5, 10, 20, 50, 100]; // Define the pageOptions array here

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
            return of({ total: 0, data: [] });
          }),
          finalize(() => this.isLoadingRecords = false)
        )
        .subscribe(response => {
          this.totalRecords = response.total;
          this.records = response.data.map((item: any) => {
            if (item.records.length === 0) {
              return {
                record_id: null,
                indicator_name: item.indicator_name,
                saiId: item.sai_id,
                value: '',
                date: `${year}-${String(month).padStart(2, '0')}-01`,
                isInserted: false,
                isUpdating: false,
                isEditing: false
              };
            } else {
              return item.records.map((record: any) => ({
                record_id: record.record_id,
                indicator_name: item.indicator_name,
                saiId: item.sai_id,
                value: record.value,
                date: record.date,
                isInserted: record.value !== '0',
                isUpdating: false,
                isEditing: false
              }));
            }
          }).flat();
        });
      console.log('Records loaded:', this.records);
    }
  }

  editRecord(record: Record): void {
    if (record.isInserted && !record.isEditing) {
      record.isEditing = true;
      return;
    }

    if (String(record.value).trim() === '') {
      this.setNotification('O valor não pode estar vazio', 'error');
      return;
    }

    const valueAsNumber = Number(record.value);
    if (isNaN(valueAsNumber) || !Number.isInteger(valueAsNumber) || valueAsNumber <= 0) {
      this.setNotification('O valor deve ser um número inteiro maior que 0', 'error');
      return;
    }

    if (record.record_id) {
      record.isUpdating = true;
      this.recordService.updateRecord(record.record_id, record)
        .pipe(finalize(() => {
          record.isUpdating = false;
          record.isEditing = false;
        }))
        .subscribe(
          () => this.setNotification('Registro atualizado com sucesso', 'success'),
          error => this.setNotification(this.getErrorMessage(error), 'error')
        );
    } else {
      const newRecord = {
        sai_id: record.saiId,
        value: record.value,
        date: record.date
      };
      record.isUpdating = true;
      this.storeRecord(newRecord);
    }
  }

  storeRecord(newRecord: any): void {
    this.recordService.storeRecord(newRecord)
      .pipe(finalize(() => newRecord.isUpdating = false))
      .subscribe(
        () => {
          this.setNotification('Registro criado com sucesso', 'success');
          this.loadRecords();
        },
        error => this.setNotification(this.getErrorMessage(error), 'error')
      );
  }

  onValueChange(record: Record): void {
    const index = this.records.findIndex(r => r.record_id === record.record_id);
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

  onPageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRecords();
  }

  trackByIndex(index: number, item: any): number {
    return item.record_id;
  }

  numberToMonth(monthNumber: number | undefined): string {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    if (monthNumber === undefined || monthNumber < 1 || monthNumber > 12) {
      throw new Error("Número do mês deve estar entre 1 e 12.");
    }

    return months[monthNumber - 1];
  }
}