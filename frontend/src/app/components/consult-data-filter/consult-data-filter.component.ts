import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Filter } from '../../models/accumulatedDataFilter.model'

@Component({
  selector: 'app-consult-data-filter',
  standalone: true,
  imports: [ FormsModule],
  templateUrl: './consult-data-filter.component.html',
  styleUrl: './consult-data-filter.component.scss'
})
export class ConsultDataFilterComponent {
  filter: Filter = {
    indicator: "Consultas Marcadas e não Realizadas", //colocar um indicator default para mais tarde
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString()
  }

  @Output() filterData = new EventEmitter<{ outgoingFilter: Filter }>();

  ngOnInit(): void {
    this.emitFilter();
  }

  emitFilter(){
    console.log(`Indicator: ${this.filter.indicator}; Month: ${this.filter.month}; Year: ${this.filter.year}`);
    this.filterData.emit({ outgoingFilter: this.filter });
  }
}
