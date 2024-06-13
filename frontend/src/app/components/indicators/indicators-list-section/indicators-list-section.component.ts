import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink, Router } from '@angular/router';

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
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  templateUrl: './indicators-list-section.component.html',
  styleUrl: './indicators-list-section.component.scss'
})
export class IndicatorsListSectionComponent {
  isLoading: boolean = false;
  totalIndicators: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;


  @Input() indicators: Indicator[] = [];
  indicatorForms: { [key: number]: FormGroup } = {};

  constructor(private fb: FormBuilder, private router: Router) { }

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

  navigateToEditIndicator(indicatorID: any){
    this.router.navigate([`indicatorsEdit/${indicatorID}`]);
  }

  navigateToCreateIndicator() {
    this.router.navigate(['createIndicators']);
  }
  

  removeIndicator(id: any){
    //abrir modal para remover user
    //remover da lista local e da DB
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
   /*  this.loadIndicators();  */ // Carrega os usuários com a página e tamanho de página atualizados
  }
}
