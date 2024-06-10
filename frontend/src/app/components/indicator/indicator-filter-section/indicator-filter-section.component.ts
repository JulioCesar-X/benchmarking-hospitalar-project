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
  imports: [CommonModule,
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
  date: Date = new Date(this.year, this.month);

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


  getIndicators(): void {
    this.indicatorService.getAllSaiIndicators(this.serviceId, this.activityId, this.date).subscribe({
      next: (data) => {
        console.log('Indicators data:', data);
        this.indicatorsList = data;
        this.indicatorsUpdated.emit(this.indicatorsList);  // Emitindo os dados atualizados
      },
      error: (error) => {
        console.error('Error fetching indicators:', error);
      }
    });
  }
}
