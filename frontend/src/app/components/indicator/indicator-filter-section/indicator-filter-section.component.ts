import { Component, Output, EventEmitter } from '@angular/core';
import { Filter } from '../../../models/accumulatedDataFilter.model';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Indicator } from '../../../models/indicator.model'
import { Activity } from '../../../models/activity.model'
import { ActivityService } from '../../../services/activity.service'
import { IndicatorService} from '../../../services/indicator.service'

@Component({
  selector: 'app-indicator-filter-section',
  standalone: true,
  imports: [CommonModule,
    FormsModule
  ],
  templateUrl: './indicator-filter-section.component.html',
  styleUrl: './indicator-filter-section.component.scss'
})
export class IndicatorFilterSectionComponent {
  indicatorsList: Array<Indicator> = [];
  activitiesList: Array<Activity> = [];

  @Output() filterData = new EventEmitter<Filter>();

  filter: Filter = {
    indicator: "Consultas Marcadas e não Realizadas",
    activity: "Psiquiatria Infância e Adolescência",
    service: "Hospital Dia", //add isso
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString()
  }
}
