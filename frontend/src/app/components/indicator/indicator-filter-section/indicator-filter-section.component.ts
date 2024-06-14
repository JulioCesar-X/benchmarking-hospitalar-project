import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Activity } from '../../../models/activity.model';
import { ActivityService } from '../../../services/activity.service';
import { IndicatorService } from '../../../services/indicator.service';
import { ServiceService } from '../../../services/service.service';
import { Service } from '../../../models/service.model';
import { Indicator } from '../../../models/indicator.model';

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
  @Input() selectedTab: string = 'Records';

  constructor(private indicatorService: IndicatorService, private activityService: ActivityService, private serviceService: ServiceService) { }

  indicatorsList: Array<Indicator> = [];
  activitiesList: Array<Activity> = [];
  servicesList: Array<Service> = [];


  activity_id!: number;
  service_id!: number;
  month!: number;
  year!: number;
  date!: Date;
  isSubmitted = false;

  @Output() indicatorsUpdated = new EventEmitter<Indicator[]>();
  @Output() loadingStateChanged = new EventEmitter<boolean>(); // Adiciona um novo EventEmitter para o estado de carregamento

  ngOnInit() { //pega tudo oque tem na tabela, de ser escolhido serviço libera um drop da atividade
    //this.getActivities();
    this.getServices();
  }

  getActivities(): void {
    if (this.service_id) {
      this.activityService.getActivitiesByServiceID(this.service_id).subscribe(
        (data: Activity[]) => {
          this.activitiesList = data; 
        },
        (error) => {
          console.error('Error fetching activities:', error); 
        }
      );
    }
  }

  onServiceSelected(serviceId: number) {
    this.service_id = serviceId;
    this.getActivities();
  }

  getServices() {
    this.serviceService.getServices().subscribe(data => {
      this.servicesList = data;
    });
  }

  getIndicators(): void {
    this.isSubmitted = true;
    this.loadingStateChanged.emit(true); 
    if (this.selectedTab === 'Records') {
      this.getRecords();
    } else {
      this.getGoals();
    }
  }

  getRecords(): void {
    if (this.month < 1 || this.month > 12) {
      console.error('Invalid month:', this.month);
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.year) {
      console.error('Year is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.service_id) {
      console.error('Service ID is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.activity_id) {
      console.error('Activity ID is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    this.date = new Date(this.year, this.month - 1);
    const dateStr = this.date.toISOString().split('T')[0];
    this.indicatorService.getAllSaiIndicators(this.service_id, this.activity_id, this.date).subscribe({
      next: (data: Indicator[]) => {
        console.log('Indicators data:', data);
        this.indicatorsList = data;
        this.indicatorsUpdated.emit(this.indicatorsList);
        this.loadingStateChanged.emit(false); // Define isLoading como false quando os dados forem recebidos
      },
      error: (error) => {
        console.error('Error fetching indicators:', error);
        this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      }
    });
  }

  getGoals(): void {
    if (!this.year) {
      console.error('Year is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.service_id) {
      console.error('Service ID is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    if (!this.activity_id) {
      console.error('Activity ID is required');
      this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      return;
    }
    this.indicatorService.getAllSaiGoals(this.service_id, this.activity_id, this.year).subscribe({
      next: (data: Indicator[]) => {
        console.log('Goals data:', data);
        this.indicatorsList = data;
        this.indicatorsUpdated.emit(this.indicatorsList);
        this.loadingStateChanged.emit(false); // Define isLoading como false quando os dados forem recebidos
      },
      error: (error) => {
        console.error('Error fetching goals:', error);
        this.loadingStateChanged.emit(false); // Define isLoading como false em caso de erro
      }
    });
  }
}
