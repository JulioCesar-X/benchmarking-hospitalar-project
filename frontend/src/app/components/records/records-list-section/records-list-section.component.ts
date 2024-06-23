import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Indicator } from '../../../models/indicator.model';
import { Filter } from '../../../models/Filter.model';
import { RecordService } from '../../../services/record.service';
import { IndicatorService } from '../../../services/indicator.service';

@Component({
  selector: 'app-records-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './records-list-section.component.html',
  styleUrls: ['./records-list-section.component.scss']
})
export class RecordsListSectionComponent implements OnInit, OnChanges {
  @Input() filter: Filter | undefined;
  @Input() indicators: Indicator[] = [];
  @Input() isLoading: boolean = false;

  isLoadingRecords: boolean = true;
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  records: any[] = [];

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recordService: RecordService,
    private indicatorService: IndicatorService
  ) {}

  ngOnInit(): void {
    this.GetRecords();
    console.log(`Filter received:`, this.filter);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      console.log('Filter changed:', this.filter);
      this.GetRecords();
    }
  }

  GetRecords(): void {
    if (this.filter && this.filter.year && this.filter.month && this.filter.serviceId && this.filter.activityId) {
      this.isLoadingRecords = true;
      let date = new Date(this.filter.year, this.filter.month - 1);
      const dateStr = date.toISOString().split('T')[0];

      let serviceID = parseInt(this.filter.serviceId);
      let activityId = parseInt(this.filter.activityId);

      this.indicatorService.getAllSaiRecords(serviceID, activityId, date).subscribe({
        next: (data) => {
          if (data && Array.isArray(data)) {
            console.log(data);

            this.records = data.map(record => {
              if (record.records && record.records[0] !== undefined) {
                return {
                  id: record.records[0].record_id,
                  indicatorName: record.indicator_name,
                  saiId: record.sai_id,
                  value: record.records[0].value,
                  isInserted: record.records[0].value !== '0',
                  isUpdating: false
                };
              } else {
                return null;
              }
            }).filter(record => record !== null);

            console.log(this.records);
          } else {
            console.warn('Data is not an array:', data);
            this.isLoadingRecords = false;
          }
        },
        error: (error) => {
          console.error('Error fetching indicators', error);
          this.isLoadingRecords = false;
        },
        complete: () => {
          this.isLoadingRecords = false;
        }
      });
    }
  }

  onValueChange(record: any): void {
    const index = this.records.findIndex(r => r.id === record.id);
    this.records[index].value = record.value;
    console.log(this.records[index].value);
  }

  UpdateRecord(recordUpdate: any): void {
    if (recordUpdate.isInserted) {
      recordUpdate.isInserted = false;
    } else {
      recordUpdate.isUpdating = true;
      recordUpdate.isInserted = true;

      this.recordService.editRecord(recordUpdate.id, recordUpdate).subscribe(
        (response: any) => {
          recordUpdate.isUpdating = false;
          this.setNotification('Record updated successfully', 'success');
        },
        (error: any) => {
          recordUpdate.isUpdating = false;
          const errorMessage = this.getErrorMessage(error);
          this.setNotification(errorMessage, 'error');
        }
      );
    }
    console.log(recordUpdate);
  }

  setNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  getErrorMessage(error: any): string {
    if (error.status === 409) {
      return 'User already exists';
    }
    if (error.status === 400) {
      return 'Invalid email';
    }
    return 'An error occurred. Please try again later.';
  }

  trackByIndex(index: number, item: Indicator): number {
    return item.sai_id!;
  }
}
