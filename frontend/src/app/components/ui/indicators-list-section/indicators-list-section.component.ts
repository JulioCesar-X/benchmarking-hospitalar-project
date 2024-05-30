import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './indicators-list-section.component.html',
  styleUrls: ['./indicators-list-section.component.scss']
})
export class IndicatorsListSectionComponent implements OnInit {
  indicators: Indicator[] = [
    { id: 1, name: 'Indicator 1', value: '12', month: 0, year: 0, isInserted: true },
    { id: 2, name: 'Indicator 2', value: '', month: 0, year: 0, isInserted: false },
  ];

  indicatorForms: { [key: number]: FormGroup } = {};

  ngOnInit(): void {
    this.indicators.forEach(indicator => {
      const formControl = new FormControl({ value: indicator.value, disabled: indicator.isInserted }, Validators.required);
      this.indicatorForms[indicator.id] = new FormGroup({
        indicatorValue: formControl
      });
    });
  }

  toggleEdit(indicator: Indicator): void {
    indicator.isInserted = !indicator.isInserted;

    const formControl = this.indicatorForms[indicator.id].get('indicatorValue');
    if (formControl) {
      if (indicator.isInserted) {
        formControl.disable();
      } else {
        formControl.enable();
      }
    }

    // logic to update the indicator in the DB if necessary
  }

  onValueChange(indicator: Indicator, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    indicator.value = inputElement.value;
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
}
