import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ServiceService } from '../../../core/services/service/service.service';
import { Filter } from '../../../core/models/filter.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../../../core/models/service.model';

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
  
  activitiesList: { id: number, name: string }[] = [];
  indicatorsList: { id: number, name: string }[] = [];

  selectedServiceId?: number;
  selectedActivityId?: number;
  selectedIndicatorId?: number;

  filter: Filter = { month: new Date().getMonth() + 1, year: new Date().getFullYear() };

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
      console.log('Services loaded>>>:',this.servicesList);
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
      this.activitiesList = [{ id: 0, name: 'N/A' }];
    }
  }

  onActivitySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const activityId = Number(target.value);
    if (!isNaN(activityId)) {
      this.selectedActivityId = activityId;
      this.updateIndicatorSelection(activityId);
    }
  }

  updateIndicatorSelection(activityId: number) {
    const selectedActivity = this.activitiesList.find(activity => activity.id === activityId);
    if (selectedActivity) {
      const service = this.servicesList.find(service => service.activities?.some(activity => activity.id === activityId));
      if (service) {
        this.indicatorsList = service.indicators || [];
      }
    }
  }

  sendFilter() {
    this.filterEvent.emit({
      serviceId: this.selectedServiceId,
      activityId: this.selectedActivityId,
      indicatorId: this.selectedIndicatorId,
      month: this.filter.month,
      year: this.filter.year
    });
    console.log('Filtro enviado:', this.filter);
  }
}
