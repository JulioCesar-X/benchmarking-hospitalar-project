import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { IndicatorService } from '../../../services/indicator.service';
import { Indicator } from '../../../models/indicator.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-indicators-list-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatPaginatorModule],
  templateUrl: './indicators-list-section.component.html',
  styleUrls: ['./indicators-list-section.component.scss']
})
export class IndicatorsListSectionComponent implements OnInit {
  isLoadingIndicators: boolean = true;
  pageSize: number = 10;
  currentPage: number = 0;
  totalIndicators: number = 0; // Adicionando total de indicadores
  indicators: Indicator[] = [];

  constructor(
    private router: Router,
    private indicatorService: IndicatorService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPageIndicators();
  }

  loadPageIndicators(): void {
    this.isLoadingIndicators = true;
    this.indicatorService.getIndicatorsByPage(this.currentPage + 1, this.pageSize).subscribe({
      next: (response: { data: Indicator[], total: number }) => {
        console.log('Indicators loaded:', response);
        this.indicators = response.data;
        this.totalIndicators = response.total;
        this.isLoadingIndicators = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('There was an error!', error);
        this.isLoadingIndicators = false;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPageIndicators();
  }


  navigateToCreateIndicator(): void {
    this.router.navigate(['indicators/create']);
  }

  navigateToEditIndicator(indicator: Indicator): void {
    this.router.navigate([`indicators/update/${indicator.id}`]);
  }

  removeIndicator(indicator: Indicator): void {
    if (indicator.id !== undefined) {
      this.indicatorService.removeIndicator(indicator.id).subscribe({
        next: () => {
          this.snackBar.open('Indicador removido com sucesso!', 'Fechar', { duration: 3000 });
          this.loadPageIndicators(); // Recarrega a lista de indicadores
        },
        error: (error) => {
          this.snackBar.open('Erro ao remover o indicador.', 'Fechar', { duration: 3000 });
          console.error('Error removing indicator:', error);
        }
      });
    } else {
      this.snackBar.open('Falha ao tentar remover indicador sem ID.', 'Fechar', { duration: 3000 });
      console.error('Attempted to remove an indicator without an ID');
    }
  }

  trackByIndex(index: number, item: any): number {
    return item.id;
  }
}
