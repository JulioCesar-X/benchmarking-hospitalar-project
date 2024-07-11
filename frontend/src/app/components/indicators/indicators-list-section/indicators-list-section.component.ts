import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { IndicatorService } from '../../../core/services/indicator/indicator.service';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';
import { PaginatorComponent } from '../../shared/paginator/paginator.component';
import { Indicator } from '../../../core/models/indicator.model';
import { DialogContentComponent } from '../../shared/dialog-content/dialog-content.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-indicators-list-section',
  templateUrl: './indicators-list-section.component.html',
  styleUrls: ['./indicators-list-section.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    LoadingSpinnerComponent,
    PaginatorComponent,
    DialogContentComponent,
    MatTooltipModule,
    MatSortModule
  ]
})
export class IndicatorsListSectionComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() indicators: Indicator[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;
  dataSource: MatTableDataSource<Indicator> = new MatTableDataSource<Indicator>([]);
  sortedIndicators: Indicator[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private indicatorService: IndicatorService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.indicators.length) {
      this.loadIndicators();
    } else {
      this.isLoading = false;
      this.sortedIndicators = this.indicators.slice();
      this.dataSource.data = this.sortedIndicators;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicators'] && !changes['indicators'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.indicators.length;
      this.sortedIndicators = this.indicators.slice();
      this.dataSource.data = this.sortedIndicators;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadIndicators(pageIndex = 0, pageSize = 10): void {
    this.isLoading = true;
    this.indicatorService.getIndicatorsPaginated(pageIndex + 1, pageSize).subscribe({
      next: (data) => {
        this.indicators = data.data;
        this.totalLength = data.total;
        this.currentPage = pageIndex;
        this.isLoading = false;
        this.sortedIndicators = this.indicators.slice();
        this.dataSource.data = this.sortedIndicators;
      },
      error: (error) => {
        console.error("Error loading paginated indicators:", error);
        this.isLoading = false;
      }
    });
  }

  openDialog(indicator: Indicator | null, action: string): void {
    if (action === 'delete' && indicator) {
      const dialogRef = this.dialog.open(DialogContentComponent, {
        data: {
          message: `Tem a certeza que quer remover o indicador ${indicator.indicator_name}?`,
          loadingMessage: 'Removendo indicador...'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deleteIndicator(indicator.id ? indicator.id : 0);
        }
      });
    } else if (action === 'edit' && indicator) {
      this.router.navigate([`/indicators/update/${indicator.id}`]);
    } else if (action === 'create') {
      this.router.navigate(['/indicators/create']);
    }
  }

  deleteIndicator(indicatorId: number): void {
    this.indicatorService.destroyIndicator(indicatorId).subscribe({
      next: (data) => {
        this.loadIndicators(this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.error("Error deleting indicator:", error);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadIndicators(this.currentPage, this.pageSize);
  }

  sortData(sort: Sort) {
    const data = this.indicators.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedIndicators = data;
      this.dataSource.data = this.sortedIndicators;
      return;
    }

    this.sortedIndicators = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'indicator_name':
          return this.compare(a.indicator_name.toLowerCase(), b.indicator_name.toLowerCase(), isAsc);
        default:
          return 0;
      }
    });

    this.dataSource.data = this.sortedIndicators;
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}