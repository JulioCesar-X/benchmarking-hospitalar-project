import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Filter } from '../../../models/accumulatedDataFilter.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Indicator } from '../../../models/indicator.model'
import { Activity } from '../../../models/activity.model'
import { ActivityService } from '../../../services/activity.service'
import { IndicatorService } from '../../../services/indicator.service'
import { get } from 'animejs';
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
  indicatorsList: Array<Indicator> = [];
  activitiesList: Array<Activity> = [];
  servicesList: Array<Service> = [];

  @Output() filterData = new EventEmitter<Filter>();

  filter: Filter = {
    indicator: "Consultas Marcadas e não Realizadas",
    activity: "Psiquiatria Infância e Adolescência",
    service: "Hospital Dia", //add isso
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString()
  }
  ngOnInit() {
    this.getIndicators();
    this.getActivities();
    this.getServices();
  }
  emitFilter() {
    this.filterData.emit(this.filter);
  }
  getIndicators() {
    this.indicatorService.getIndicators().subscribe(data => {
      this.indicatorsList = data;
    });
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
}
