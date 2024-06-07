import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Filter } from '../../models/accumulatedDataFilter.model'
import { Activity } from '../../models/activity.model'
import { ActivityService } from '../../services/activity.service'
import { IndicatorService } from '../../services/indicator.service'
import { ServiceService } from '../../services/service.service'
import { Service } from '../../models/service.model'
import { Indicator } from '../../models/indicator.model'





@Component({
  selector: 'app-consult-data-filter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './consult-data-filter.component.html',
  styleUrl: './consult-data-filter.component.scss'
})
export class ConsultDataFilterComponent {
  indicatorsList: Array<Indicator> = [];
  activitiesList: Array<Activity> = [];
  servicesList: Array<Service> = [];

  filter: Filter = {
    indicator: "Consultas Marcadas e não Realizadas", //colocar um indicator default para mais tarde
    activity: "Psiquiatria Infância e Adolescência",
    service: "Hospital Dia",
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString()
  }

  @Output() filterData = new EventEmitter<Filter>();

  constructor(private indicatorService: IndicatorService,
    private activityService: ActivityService,
    private serviceService: ServiceService){
    this.emitFilter();
  };

  ngOnInit(): void {
   this.getIndicators();
   this.getActivities();
    this.getService();
  }

  trackByIndex(index: number, item: any): any {
    return item.id;
  }

  emitFilter(){
    console.log("FILTRO EMITIDO:", this.filter);
    this.filterData.emit(this.filter);
  }

  getIndicators(){
    this.indicatorService.getIndicators().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          this.indicatorsList = data.map(indicator => ({
            id: indicator.id,
            indicator_name: indicator.indicator_name
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Erro ao obter indicadores', error);
      },
      complete: () => {
       /*  console.log("Esta é a lista de inds", JSON.stringify(this.indicatorsList, null, 2)); */
      }
    });
  }

  getActivities(){
    this.activityService.getActivities().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          this.activitiesList = data.map(activity => ({
            id: activity.id,
            activity_name: activity.activity_name
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Erro ao obter atividades', error);
      }
    });
  }
  getService() {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) { // Verifica se data não é null e é um array
          this.servicesList = data.map(service => ({
            id: service.id,
            imageUrl: null,
            service_name: service.service_name,
            description: null
          }));
        } else {
          console.warn('Data is not an array:', data);
        }
      },
      error: (error) => {
        console.error('Erro ao obter serviços', error);
      }
    });
  }

}
