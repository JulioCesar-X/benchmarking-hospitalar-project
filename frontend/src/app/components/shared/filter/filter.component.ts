import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Activity } from '../../../models/activity.model';
import { ActivityService } from '../../../services/activity.service';
import { IndicatorService } from '../../../services/indicator.service';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import { Indicator } from '../../../models/indicator.model';
import { Filter } from '../../../models/Filter.model';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input({ required: true }) indicatorsInput: boolean = false;
  @Input({ required: true }) dataInsertedCheckbox: boolean = false;

  constructor(private indicatorService: IndicatorService, private activityService: ActivityService, private serviceService: ServiceService) { }

  indicatorsList: Array<Indicator> = [];
  activitiesList: Array<Activity> = [];
  servicesList: Array<Service> = [];

  filter: Filter = {
    serviceId: "",
    activityId: "",
    indicatorId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  date!: Date;

  @Output() filterEvent = new EventEmitter<Filter>();

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const activityRequest = this.activityService.getActivities();
    const serviceRequest = this.serviceService.getServices();
    const indicatorRequest =this.indicatorService.getAllIndicators();

    forkJoin([activityRequest, serviceRequest, indicatorRequest]).subscribe(
      (results: [Activity[], Service[], Indicator[]]) => {
        this.activitiesList = results[0];
        this.servicesList = results[1];
        if (this.indicatorsInput) {
          this.indicatorsList = results[2];
        }
        console.log("requests", results);
        this.initializeFilter();
      },
      error => {
        console.error('Error fetching initial data:', error);
      },
      () => {
        this.sendFilter();
      }
    );
  }

  private initializeFilter() {
    if (this.servicesList.length > 0) {
      this.filter.serviceId = this.servicesList[0].id.toString();
    }
    if (this.activitiesList.length > 0) {
      this.filter.activityId = this.activitiesList[0].id.toString();
    }
    if (this.indicatorsInput && this.indicatorsList.length > 0) {
      this.filter.indicatorId = this.indicatorsList[0].id?.toString();
    }
  }

  sendFilter() {
    console.log(`Filtro enviado:`, this.filter);
    this.filterEvent.emit(this.filter);
  }
}
