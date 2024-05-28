import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Indicator {
  id: number;
  name: string;
  value: string | null;
  month: number;
  year: number;
  isInserted: boolean;
}

@Component({
  selector: 'app-indicators-list-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './indicators-list-section.component.html',
  styleUrls: ['./indicators-list-section.component.scss']
})
export class IndicatorsListSectionComponent {

  //should receibe the list of indicators in an inInit method and populate the indicators list with
  //the apropriate isInserted bool value
  indicators: Indicator[] = [
    { id: 1, name: 'Indicator 1', value: '12', month: 0, year: 0, isInserted: true },
    { id: 2, name: 'Indicator 2', value: null, month: 0, year: 0, isInserted: false },
    // Add more indicators as needed
  ];

  toggleEdit(indicator: Indicator): void {
    if (indicator.isInserted) {
      indicator.isInserted = false; 
    } else {
      indicator.isInserted = true; 

      //logic to send the update the indicator in the DB
    }
  }

  onValueChange(indicator: any, event: any) {
    indicator.value = event.target.value;
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
}
