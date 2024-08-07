import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ServiceService } from '../../../core/services/service/service.service';
import { ActivityService } from '../../../core/services/activity/activity.service';
import { Filter } from '../../../core/models/filter.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Service } from '../../../core/models/service.model';
import { Activity } from '../../../core/models/activity.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FeedbackComponent } from '../../shared/feedback/feedback.component';
import { LoggingService } from '../../../core/services/logging.service';

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
  imports: [
    CommonModule,
    FormsModule,
    MatTooltipModule,
    FeedbackComponent,
    MatIconModule
  ]
})
export class FilterComponent implements OnInit, OnChanges {

  servicesList: Service[] = [];
  activitiesList: ActivityForFilter[] = [];
  indicatorsList: IndicatorForFilter[] = [];
  activityCache = new Map<number, Activity>();
  currentYear: number = new Date().getFullYear();

  @Input() selectedServiceId?: number | string = 0;
  @Input() selectedActivityId?: number | undefined = undefined;
  @Input() selectedIndicatorId?: number = undefined;
  @Input() showMonthInput: boolean = true;
  @Input() indicatorsInput: boolean = false;
  @Input() dataInsertedCheckbox: boolean = false;
  @Input() showServiceInput: boolean = true;
  @Input() showActivityInput: boolean = false;
  @Input() initialFilter?: Filter;

  @Output() filterEvent = new EventEmitter<Filter>();
  @Output() activityInputChange = new EventEmitter<boolean>();

  filter: Filter = { month: new Date().getMonth() + 1, year: new Date().getFullYear() };
  feedbackMessage: string = '';
  feedbackType: 'success' | 'error' = 'error';

  constructor(
    private serviceService: ServiceService,
    private activityService: ActivityService,
    private loggingService: LoggingService
  ) { }

  ngOnInit() {
    this.loadInitialData();
    if (this.initialFilter) {
      this.loggingService.info('Initial filter:', this.initialFilter);
      this.applyInitialFilter();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedServiceId'] && changes['selectedServiceId'].currentValue) {
      this.updateActivityAndIndicatorSelections(Number(changes['selectedServiceId'].currentValue));
    }
    if (changes['initialFilter'] && changes['initialFilter'].currentValue) {
      this.applyInitialFilter();
    }
  }

  loadInitialData() {
    this.serviceService.indexServices().subscribe(services => {
      this.servicesList = services;
      if (this.selectedServiceId) {
        this.updateActivityAndIndicatorSelections(Number(this.selectedServiceId));
      }
    });

    this.activityService.indexActivities().subscribe(activities => {
      this.activitiesList = activities.map(activity => ({
        id: activity.id,
        name: activity.activity_name
      }));
    });
  }

  applyInitialFilter() {
    if (this.initialFilter) {
      this.selectedServiceId = this.initialFilter.serviceId;
      this.selectedActivityId = this.initialFilter.activityId ? Number(this.initialFilter.activityId) : undefined;
      this.selectedIndicatorId = this.initialFilter.indicatorId ? Number(this.initialFilter.indicatorId) : undefined;
      this.loggingService.info('Initial indicator:', this.selectedIndicatorId);
      this.loggingService.info('Initial activity:', this.selectedActivityId);
      this.loggingService.info('Initial service:', this.selectedServiceId);
      this.filter.month = this.initialFilter.month;
      this.filter.year = this.initialFilter.year;

      if (this.selectedServiceId) {
        this.updateActivityAndIndicatorSelections(Number(this.selectedServiceId));
      }
    }
  }

  onServiceSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const serviceId = Number(target.value);
    if (!isNaN(serviceId)) {
      this.selectedServiceId = serviceId;
      this.selectedActivityId = undefined;
      this.selectedIndicatorId = undefined;
      this.updateActivityAndIndicatorSelections(serviceId);
    }
  }

  updateActivityAndIndicatorSelections(serviceId: number) {
    const selectedService = this.servicesList.find(service => service.id === serviceId);
    if (selectedService) {
      const hasActivities = selectedService.activities && selectedService.activities.length > 0;
      this.activityInputChange.emit(hasActivities);
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
        if (this.selectedActivityId) {
          this.activityService.showActivity(Number(this.selectedActivityId)).subscribe(activity => {
            this.activityCache.set(Number(this.selectedActivityId), activity);
            this.updateIndicatorSelection(activity);
          });
        } else {
          this.updateIndicatorSelection(undefined);
        }
      }
    }
  }

  onActivitySelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const activityId = target.value === 'null' ? undefined : Number(target.value);
    this.selectedActivityId = activityId !== undefined && !isNaN(activityId) ? activityId : undefined;
    if (activityId) {
      if (this.activityCache.has(activityId)) {
        const cachedActivity = this.activityCache.get(activityId);
        if (cachedActivity) {
          this.updateIndicatorSelection(cachedActivity);
        }
      } else {
        this.activityService.showActivity(activityId).subscribe(activity => {
          this.activityCache.set(activityId, activity);
          this.updateIndicatorSelection(activity);
        });
      }
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
    } else {
      const selectedService = this.servicesList.find(service => service.id === this.selectedServiceId);
      this.indicatorsList = selectedService?.indicators?.map(indicator => ({
        id: indicator.id,
        name: indicator.name
      })) || [];
    }
  }

  resetSelections() {
    this.selectedServiceId = undefined;
    this.selectedActivityId = undefined;
    this.selectedIndicatorId = undefined;
    this.activitiesList = [];
    this.indicatorsList = [];
  }

  validateFilter(): boolean {
    if (this.selectedServiceId === 0 || this.selectedServiceId === undefined) {
      this.setFeedback('Selecione um serviço.', 'error');
      return false;
    }
    if (this.showActivityInput && this.activitiesList.length > 0 && !this.selectedActivityId) {
      this.setFeedback('Selecione uma atividade.', 'error');
      return false;
    }
    if (this.indicatorsInput && !this.selectedIndicatorId) {
      this.setFeedback('Selecione um indicador.', 'error');
      return false;
    }
    return true;
  }

  sendFilter() {
    if (this.validateFilter()) {
      this.filterEvent.emit({
        serviceId: this.selectedServiceId,
        activityId: this.selectedActivityId !== undefined ? this.selectedActivityId : undefined,
        indicatorId: this.selectedIndicatorId,
        month: this.showMonthInput ? this.filter.month : undefined,
        year: this.filter.year
      });
    }
  }

  setFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => {
      this.feedbackMessage = '';
    }, 3000);
  }

  trackByServiceId(index: number, service: any): number {
    return service.id;
  }
}