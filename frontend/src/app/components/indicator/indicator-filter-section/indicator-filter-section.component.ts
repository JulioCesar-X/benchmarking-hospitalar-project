import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Activity } from '../../../models/activity.model'
import { ActivityService } from '../../../services/activity.service'
import { IndicatorService } from '../../../services/indicator.service'
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-indicator-filter-section',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './indicator-filter-section.component.html',
  styleUrl: './indicator-filter-section.component.scss'
})
export class IndicatorFilterSectionComponent implements OnInit {

  constructor(private indicatorService: IndicatorService, private activityService: ActivityService, private serviceService: ServiceService) { }

  indicatorsList: Array<any> = [];
  activitiesList: Array<Activity> = [];
  servicesList: Array<Service> = [];

  activityId!: number;
  serviceId!: number;
  month!: number;
  year!: number;
  date!: Date;

  @Output() indicatorsUpdated = new EventEmitter<any[]>();

  ngOnInit() {
    this.getActivities();
    this.getServices();
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

  // getIndicators(): void {
  //   if (this.month < 1 || this.month > 12) {
  //     console.error('Invalid month:', this.month);
  //     return;
  //   }
  //   if (!this.year) {
  //     console.error('Year is required');
  //     return;
  //   }
  //   if (!this.serviceId) {
  //     console.error('Service ID is required');
  //     return;
  //   }
  //   if (!this.activityId) {
  //     console.error('Activity ID is required');
  //     return;
  //   }

  //   this.date = new Date(this.year, this.month - 1);
  //   this.indicatorService.getAllSaiIndicators(this.serviceId, this.activityId, this.date).subscribe({
  //     next: (data) => {
  //       console.log('Indicators data:', data);
  //       this.indicatorsList = data;
  //       this.indicatorsUpdated.emit(this.indicatorsList);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching indicators:', error);
  //     }
  //   });
  // }

  getIndicators(): void {
    if (this.month < 1 || this.month > 12) {
      console.error('Invalid month:', this.month);
      return;
    }
    if (!this.year) {
      console.error('Year is required');
      return;
    }
    if (!this.serviceId) {
      console.error('Service ID is required');
      return;
    }
    if (!this.activityId) {
      console.error('Activity ID is required');
      return;
    }

    this.date = new Date(this.year, this.month - 1);
    const dateStr = this.date.toISOString().split('T')[0];
    this.indicatorService.getAllSaiIndicators(this.serviceId, this.activityId, this.date).subscribe({
      next: (data) => {
        console.log('Indicators data:', data);
        this.indicatorsList = data;
        this.indicatorsUpdated.emit(this.indicatorsList);
      },
      error: (error) => {
        console.error('Error fetching indicators:', error);
      }
    });
  }


}
