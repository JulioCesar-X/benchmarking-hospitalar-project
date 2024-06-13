import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder,FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Indicator } from '../../../models/indicator.model';

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
    if (changes['indicators']) {
      this.buildForm();
    }
  }

  buildForm(): void {
    this.indicatorForms = {};
    this.indicators.forEach(indicator => {
      const formControls: any = {};
      indicator.records?.forEach((record, index) => {
        formControls['recordValue' + index] = new FormControl({
          value: record.value || '',
          disabled: indicator.isInserted ?? false
        }, Validators.required);
      });
      if (indicator.sai_id !== undefined) {
        this.indicatorForms[indicator.sai_id] = this.fb.group(formControls);
      }
      indicator.isInserted = indicator.records?.some(record => record.value != null) || false;
    });
  }

  onValueChange(indicator: Indicator, event: Event, recordIndex: number): void {
    const inputElement = event.target as HTMLInputElement;
    indicator.records![recordIndex].value = inputElement.value;
  }

  toggleEdit(indicator: Indicator): void {
    indicator.isInserted = !indicator.isInserted;
    const formControls = this.indicatorForms[indicator.sai_id!].controls;
    Object.keys(formControls).forEach(key => {
      if (indicator.isInserted) {
        formControls[key].disable();
      } else {
        formControls[key].enable();
      }
    });
  }

  trackByIndex(index: number, item: Indicator): number {
    return item.sai_id!;
  }
}
