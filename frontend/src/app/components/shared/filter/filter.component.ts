import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ServiceService } from '../../../core/services/service/service.service';
import { Filter } from '../../../core/models/filter.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FilterComponent implements OnInit {
  servicesList: {
    id: number;
    imageUrl: string;
    name: string;
    description?: string | null;
    activities?: { id: number, name: string }[];
    indicators?: { id: number, name: string }[];
  }[] = [];

  activitiesList: { id: number | null, name: string }[] = [];
  indicatorsList: { id: number, name: string }[] = [];

  selectedServiceId?: number;
  selectedActivityId?: number | undefined;
  selectedIndicatorId?: number;

  filter: Filter = { month: new Date().getMonth() + 1, year: new Date().getFullYear() };

  @Input() showMonthInput: boolean = true;
  @Input() indicatorsInput: boolean = false;
  @Input() dataInsertedCheckbox: boolean = false;
  @Output() filterEvent = new EventEmitter<Filter>();

  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.serviceService.indexServices().subscribe(response => {
      this.servicesList = response.data;
      this.activitiesList = response.data.flatMap(service => service.activities || []);
      this.indicatorsList = response.data.flatMap(service => service.indicators || []);
    });
  }

  onServiceSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const serviceId = Number(target.value);
    if (!isNaN(serviceId)) {
      this.selectedServiceId = serviceId;
      this.updateSelections(serviceId);
    }
  }

  updateSelections(serviceId: number) {
    const selectedService = this.servicesList.find(service => service.id === serviceId);
    this.activitiesList = selectedService?.activities || [];
    this.indicatorsList = selectedService?.indicators || [];
    if (this.activitiesList.length === 0) {
      this.activitiesList = [{ id: null, name: 'N/A' }];
    } else {
      this.activitiesList.unshift({ id: null, name: 'N/A' });
    }
    this.selectedActivityId = undefined;
  }

  onActivitySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const activityId = target.value === 'null' ? undefined : Number(target.value);
    this.selectedActivityId = activityId !== undefined && !isNaN(activityId) ? activityId : undefined;
    this.updateIndicatorSelection(activityId);
  }

  updateIndicatorSelection(activityId: number | undefined) {
    if (activityId !== undefined) {
      const selectedActivity = this.activitiesList.find(activity => activity.id === activityId);
      if (selectedActivity) {
        const service = this.servicesList.find(service => service.activities?.some(activity => activity.id === activityId));
        if (service) {
          this.indicatorsList = service.indicators || [];
        }
      }
    } else {
      this.indicatorsList = [];
    }
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