import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './indicators-list-section.component.html',
  styleUrls: ['./indicators-list-section.component.scss']
})
export class IndicatorsListSectionComponent implements OnInit, OnChanges {
  
  @Input() indicators: Indicator[] = [];
  indicatorForms: { [key: number]: FormGroup } = {};

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica se a propriedade 'indicators' mudou
    if (changes['indicators']) {
      if (changes['indicators'].currentValue !== changes['indicators'].previousValue) {
        this.buildForm();  // Reconstrói os formulários quando os indicadores mudam
      }
    }
  }

  buildForm(): void {
    this.indicatorForms = {};
    this.indicators.forEach(indicator => {
      this.indicatorForms[indicator.id] = this.fb.group({
        indicatorValue: [indicator.value || '', Validators.required]
      });
      // Set isInserted based on whether value is present
      indicator.isInserted = indicator.value != null;
    });
  }

  onValueChange(indicator: Indicator, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    indicator.value = inputElement.value;
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
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }
}
