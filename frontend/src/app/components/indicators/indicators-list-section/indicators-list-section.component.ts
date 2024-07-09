import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
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
import { ActivityService } from '../../../core/services/activity/activity.service';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule
  ]
})
export class IndicatorsListSectionComponent implements OnInit, OnChanges {
  @Input() indicators: Indicator[] = [];
  @Input() isLoading = true;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  currentPage = 0;
  totalLength = 0;

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
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['indicators'] && !changes['indicators'].isFirstChange()) {
      this.isLoading = false;
      this.totalLength = this.indicators.length;
    }
    if (changes['isLoading'] && !changes['isLoading'].isFirstChange()) {
      this.isLoading = changes['isLoading'].currentValue;
    }
  }

  loadIndicators(pageIndex = 0, pageSize = 10): void {
    this.isLoading = true;
    this.indicatorService.getIndicatorsPaginated(pageIndex + 1, pageSize).subscribe({
      next: (data) => {
        console.log("Indicators Data Received:", data);
        this.indicators = data.data;
        this.totalLength = data.total;
        this.currentPage = pageIndex; // Adjust the current page index
        this.isLoading = false;
        console.log("Total length:", this.totalLength);
        console.log("Indicators list:", this.indicators);
        console.log("Current page:", this.currentPage);
      },
      error: (error) => {
        console.error("Error loading paginated indicators:", error);
        this.isLoading = false;
      },
      complete: () => {
        console.log("Indicator loading complete.");
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
          this.deleteIndicator(indicator.id? indicator.id : 0);
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
        console.log("Indicator deleted:", data);
        this.loadIndicators(this.currentPage, this.pageSize);
      },
      error: (error) => {
        console.error("Error deleting indicator:", error);
      },
      complete: () => {
        console.log("Indicator deletion complete.");
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    console.log("Page Event Triggered:", event);
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadIndicators(this.currentPage, this.pageSize);
  }
}