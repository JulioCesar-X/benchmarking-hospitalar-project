import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Indicator } from '../../../models/indicator.model';

@Component({
  selector: 'app-records-list-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './records-list-section.component.html',
  styleUrls: ['./records-list-section.component.scss']
})
export class RecordsListSectionComponent implements OnInit, OnChanges {
  @Input() indicators: Indicator[] = [];
  @Input() isLoading: boolean = false; // Adiciona a propriedade isLoading
  indicatorForms: { [key: number]: FormGroup } = {};

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicators']) {
      if (changes['indicators'].currentValue !== changes['indicators'].previousValue) {
        this.buildForm();
      }
    }
  }

  buildForm(): void {
    this.indicatorForms = {};
    this.indicators.forEach(indicator => {
      const formControls: any = {};
      const isInserted = indicator.isInserted ?? false;  // Garantir que isInserted seja sempre boolean
      indicator.records?.forEach((record, index) => {
        formControls['recordValue' + index] = new FormControl({ value: record.value || '', disabled: isInserted }, Validators.required);
      });
      this.indicatorForms[indicator.sai_id!] = this.fb.group(formControls);
      indicator.isInserted = indicator.records?.some(record => record.value != null) ?? false;
    });
  }

  onValueChange(indicator: Indicator, event: Event, recordIndex: number): void {
    const inputElement = event.target as HTMLInputElement;
    indicator.records![recordIndex].value = inputElement.value;
  }

  toggleEdit(indicator: Indicator): void {
    indicator.isInserted = !indicator.isInserted;
    const form = this.indicatorForms[indicator.sai_id!];
    if (form) {
      if (indicator.isInserted) {
        Object.keys(form.controls).forEach(key => form.get(key)?.disable());
      } else {
        Object.keys(form.controls).forEach(key => form.get(key)?.enable());
      }
    }
  }

  trackByIndex(index: number, item: Indicator): number {
    return item.sai_id!;
  }
}
