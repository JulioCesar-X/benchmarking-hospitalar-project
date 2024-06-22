import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Activity } from '../../../models/activity.model'
import { ActivityService } from '../../../services/activity.service'
import { IndicatorService } from '../../../services/indicator.service'
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import { Filter } from '../../../models/Filter.model'
import { Indicator } from '../../../models/indicator.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [ CommonModule,
    FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input({required: true}) indicatorsInput: boolean = false;
  @Input({required: true}) dataInsertedCheckbox: boolean = false;

  constructor(private indicatorService: IndicatorService, private activityService: ActivityService, private serviceService: ServiceService) { }

  indicatorsList: Array<any> = [];
  activitiesList: Array<Activity> = [];
  servicesList: Array<Service> = [];

  filter: Filter = {
    serviceId: "",
    activityId: "",
    indicatorId: "",
    month: 0,
    year: 0,
  }

  date!: Date;

  @Output() filterData = new EventEmitter<Filter>();

  ngOnInit() {
    this.getActivities();
    this.getServices();
    this.getAllIndicators();
  }

  sendFilter() {
    this.filterData.emit(this.filter);
  }

  getActivities() {
    this.activityService.getActivities().subscribe(data => {
      this.activitiesList = data;
    });
  }

  getServices() {
    this.serviceService.getServices().subscribe(data => {
      this.servicesList = data;
    });
  }

  getAllIndicators() {
    this.indicatorService.getIndicators().subscribe({
      next: (response: any) => {
        this.indicatorsList = response.data; // Assuming the indicators are wrapped in a data property
        console.log('Indicators:', this.indicatorsList);
      },
    });
  }

  getIndicators(): void {
    if (this.filter.month < 1 || this.filter.month > 12) {
      console.error('Invalid month:', this.filter.month);
      return;
    }
    if (!this.filter.year) {
      console.error('Year is required');
      return;
    }
    if (!this.filter.serviceId) {
      console.error('Service ID is required');
      return;
    }
    if (!this.filter.activityId) {
      console.error('Activity ID is required');
      return;
    }
    this.date = new Date(this.filter.year, this.filter.month - 1);
    const dateStr = this.date.toISOString().split('T')[0];
    this.indicatorService.getAllSaiIndicators(parseInt(this.filter.serviceId), parseInt(this.filter.activityId), this.date).subscribe({
      next: (data) => {
        console.log('Indicators data:', data);
        this.indicatorsList = data;
       /*  this.filterData.emit(this.indicatorsList);  *///porque emite os indicadores????
      },
      error: (error) => {
        console.error('Error fetching indicators:', error);
      }
    });
  }
}


