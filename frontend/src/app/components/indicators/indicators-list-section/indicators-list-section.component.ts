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
  allIndicators: Indicator[] = [];
  loadedPages: Set<number> = new Set();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private indicatorService: IndicatorService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.indicators.length) {
      this.loadIndicators(0, 30);
    } else {
      this.isLoading = false;
      this.allIndicators = this.indicators.slice();
      this.updateDataSource();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicators'] && !changes['indicators'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.indicators.length;
      this.allIndicators = this.indicators.slice();
      this.updateDataSource();
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadIndicators(pageIndex = 0, pageSize = 30): void {
    this.isLoading = true;
    this.indicatorService.getIndicatorsPaginated(pageIndex + 1, pageSize).subscribe({
      next: (data) => {
        if (pageIndex === 0) {
          this.allIndicators = data.data;
        } else {
          this.allIndicators = [...this.allIndicators, ...data.data];
        }
        this.totalLength = data.total;
        this.updateDataSource();
        this.loadedPages.add(pageIndex);
        this.isLoading = false;
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
      next: () => {
        this.allIndicators = this.allIndicators.filter(indicator => indicator.id !== indicatorId);
        this.updateDataSource();
      },
      error: (error) => {
        console.error("Error deleting indicator:", error);
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    if (!this.loadedPages.has(this.currentPage)) {
      this.loadIndicators(this.currentPage, this.pageSize * 3);
    } else {
      this.dataSource.data = this.allIndicators.slice(startIndex, endIndex);
    }
  }

  sortData(sort: Sort) {
    const data = this.allIndicators.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data.slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'indicator_name':
          return this.compare(a.indicator_name, b.indicator_name, isAsc);
        default:
          return 0;
      }
    }).slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
  }

  compare(a: string, b: string, isAsc: boolean): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' }) * (isAsc ? 1 : -1);
  }

  updateDataSource(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource = new MatTableDataSource(this.allIndicators.slice(startIndex, endIndex));
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }
}