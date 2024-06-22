import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Activity } from '../../../models/activity.model'
import { ActivityService } from '../../../services/activity.service'
import { IndicatorService } from '../../../services/indicator.service'
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import { Filter } from '../../../models/Filter.model'
import { forkJoin } from 'rxjs';


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
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  date!: Date;

  @Output() filterEvent = new EventEmitter<Filter>();

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const requests = [
      this.activityService.getActivities(),
      this.serviceService.getServices()
    ];

    if (this.indicatorsInput) {
      requests.push(this.indicatorService.getIndicators());
    }

    forkJoin(requests).subscribe(
      (results: any[]) => {
        this.activitiesList = results[0];
        this.servicesList = results[1];
        if (this.indicatorsInput) {
          this.indicatorsList = results[2];
        }
        
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


  //faz o select para o HTML
  private initializeFilter() {
    // Set initial filter values
    if (this.servicesList.length > 0) {
      this.filter.serviceId = this.servicesList[0].id.toString(); // Assuming 'id' is the property containing the ID
    }
    if (this.activitiesList.length > 0) {
      this.filter.activityId = this.activitiesList[0].id.toString(); // Assuming 'id' is the property containing the ID
    }
    if (this.indicatorsInput && this.indicatorsList.length > 0) {
      this.filter.indicatorId = this.indicatorsList[0].id; // Assuming 'id' is the property containing the ID
    }
  }

  sendFilter() {
    console.log(`Filtro enviado:`, this.filter)
    this.filterEvent.emit(this.filter);
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

  getIndicators(){
    this.indicatorService.getIndicators().subscribe(data => {
      this.indicatorsList = data;
    });
  }


  //ESTE METODO ESTA PUXAR RECORDS PARA O FILTRO.
  //SO QUEREMOS COISAS RELACIONADAS COM O SAI NO FILTRO. NADA DE LISTAS DE USERS/RECORSD/ OU DE DADOS
/*   getIndicators(): void {
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
         this.indicatorsUpdated.emit(this.indicatorsList);  
      },
      error: (error) => {
        console.error('Error fetching indicators:', error);
      }
    });
  } */
}


