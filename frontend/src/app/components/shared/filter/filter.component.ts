import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Filter } from '../../../core/models/filter.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { Activity } from '../../../core/models/activity.model';

interface ActivityForFilter {
  id: number | null;
  name: string;
}

interface IndicatorForFilter {
  id: number;
  name: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FilterComponent implements OnInit {
  servicesList: Service[] = [];
  activitiesList: ActivityForFilter[] = [];
  indicatorsList: IndicatorForFilter[] = [];

  @Input() selectedServiceId?: number;
  selectedActivityId?: number | undefined;
  selectedIndicatorId?: number;

  filter: Filter = { month: new Date().getMonth() + 1, year: new Date().getFullYear() };

  @Input() showMonthInput: boolean = true;
  @Input() indicatorsInput: boolean = false;
  @Input() dataInsertedCheckbox: boolean = false;
  @Input() showServiceInput: boolean = true;  // New input property to show or hide service input
  @Output() filterEvent = new EventEmitter<Filter>();

  constructor(private serviceService: ServiceService, private activityService: ActivityService) { }

  ngOnInit() {
    if (this.showServiceInput) {
      this.loadInitialData();
    } else {
      this.loadActivitiesAndIndicators();
    }
  }

  loadInitialData() {
    this.serviceService.indexServices().subscribe(services => {
      this.servicesList = services;
      this.resetSelections();
      console.log('Services loaded:', this.servicesList);
    });

    this.activityService.indexActivities().subscribe(activities => {
      this.activitiesList = activities.map(activity => ({
        id: activity.id,
        name: activity.activity_name
      }));
      console.log('Activities loaded:', this.activitiesList);
    });
  }

  loadActivitiesAndIndicators() {
    this.activityService.indexActivities().subscribe(activities => {
      this.activitiesList = activities.map(activity => ({
        id: activity.id,
        name: activity.activity_name
      }));
      console.log('Activities loaded:', this.activitiesList);
    });
  }

  onServiceSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const serviceId = Number(target.value);
    if (!isNaN(serviceId)) {
      this.selectedServiceId = serviceId;
      this.updateActivityAndIndicatorSelections(serviceId);
    }
  }

  updateActivityAndIndicatorSelections(serviceId: number) {
    const selectedService = this.servicesList.find(service => service.id === serviceId);
    if (selectedService) {
      this.activitiesList = selectedService.activities?.map(activity => ({
        id: activity.id,
        name: activity.name
      })) || [];

      if (this.activitiesList.length === 0) {
        this.indicatorsList = selectedService.indicators?.map(indicator => ({
          id: indicator.id,
          name: indicator.name
        })) || [];
      } else {
        this.indicatorsList = [];
      }

      this.selectedActivityId = undefined;
      this.selectedIndicatorId = undefined;
      console.log('Selected service:', selectedService);
      console.log('Activities and Indicators updated on service select:', this.activitiesList, this.indicatorsList);
    }
  }

  onActivitySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const activityId = target.value === 'null' ? undefined : Number(target.value);
    this.selectedActivityId = activityId !== undefined && !isNaN(activityId) ? activityId : undefined;
    console.log('Activity ID selected:', activityId);
    if (activityId) {
      this.activityService.showActivity(activityId).subscribe(activity => {
        this.updateIndicatorSelection(activity);
      });
    } else {
      this.updateIndicatorSelection(undefined);
    }
  }

  updateIndicatorSelection(activity: Activity | undefined) {
    if (activity) {
      this.indicatorsList = activity.sais?.map(sai => ({
        id: sai.indicator.id,
        name: sai.indicator.indicator_name
      }))
        .filter((value, index, self) => self.findIndex(v => v.id === value.id) === index) || [];
      console.log('Indicators filtered by activity:', this.indicatorsList);
    } else {
      // Se nenhuma atividade for selecionada, mostrar todos os indicadores relacionados ao serviço selecionado
      const selectedService = this.servicesList.find(service => service.id === this.selectedServiceId);
      this.indicatorsList = selectedService?.indicators?.map(indicator => ({
        id: indicator.id,
        name: indicator.name
      })) || [];
    }
    this.selectedIndicatorId = undefined;  // Resetar a seleção de indicador quando uma nova atividade é selecionada

    console.log('Indicators updated on activity select:', this.indicatorsList);
  }

  resetSelections() {
    this.selectedServiceId = undefined;
    this.selectedActivityId = undefined;
    this.selectedIndicatorId = undefined;
    this.activitiesList = [];
    this.indicatorsList = [];
  }

  sendFilter() {
    this.filterEvent.emit({
      serviceId: this.selectedServiceId,
      activityId: this.selectedActivityId !== undefined ? this.selectedActivityId : null,
      indicatorId: this.selectedIndicatorId,
      month: this.showMonthInput ? this.filter.month : undefined,
      year: this.filter.year
    });
  }
}