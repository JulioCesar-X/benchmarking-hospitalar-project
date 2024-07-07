import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IndicatorService } from '../../core/services/indicator/indicator.service';
import { MatMenuModule } from '@angular/material/menu';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as ExcelJS from 'exceljs';
import { AuthService } from '../../core/services/auth/auth.service';
import { FilterComponent } from '../../components/shared/filter/filter.component';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner/loading-spinner.component';
import { Filter } from '../../core/models/filter.model';
import { ChartsComponent } from '../../components/charts/charts.component';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartsComponent,
    MatMenuModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss']
})
export class ChartsPageComponent implements OnInit {
  selectedTab: string = 'Producao';
  filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };
  graphData: any = {};
  isLoading: any = {};
  isAdminOrCoordinator: boolean = false;
  showActivityInput: boolean = false;

  private filterSubject = new Subject<Partial<Filter>>();

  constructor(
    private indicatorService: IndicatorService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdminOrCoordinator = role === 'admin' || role === 'coordenador';

    this.route.params.subscribe(params => {
      this.filter.serviceId = +params['serviceId'] || this.filter.serviceId;
      this.loadGraphData();
    });

    this.filterSubject.pipe(
      debounceTime(300),
      switchMap(filter => {
        this.setLoadingStates(true);
        return this.indicatorService.getAllData({ ...this.filter, ...filter });
      })
    ).subscribe({
      next: (data) => {
        this.graphData = data;
        this.setLoadingStates(false);
      },
      error: (error) => {
        this.setLoadingStates(false);
      }
    });
  }

  loadGraphData(): void {
    this.filterSubject.next(this.filter);
  }

  handleFilterData(event: Partial<Filter>): void {
    this.filter = {
      ...this.filter,
      ...event
    };
    this.loadGraphData();
  }

  handleActivityInputChange(show: boolean): void {
    this.showActivityInput = show;
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  toTopBtnVisible = false;

  numberToMonth(monthNumber: number | undefined): string {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    if (monthNumber! < 1 || monthNumber! > 12) {
      throw new Error("Número do mês deve estar entre 1 e 12.");
    }

    return months[monthNumber! - 1];
  }

  exportToPdf(): void {
    const element = document.querySelector('.graphicsContainer') as HTMLElement;
    if (element) {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('graficos.pdf');
      }).catch(error => {
        console.error('Erro ao gerar canvas:', error);
      });
    } else {
      console.error('Elemento não encontrado');
    }
  }

  exportToExcel(): void {
    const data = this.prepareChartData();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DadosGraficos');

    worksheet.columns = [
      { header: 'Mes', key: 'Mes', width: 20 },
      { header: 'Valor', key: 'Valor', width: 20 }
    ];

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dados_graficos.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch((error) => {
      console.error('Erro ao gerar o arquivo Excel:', error);
    });
  }

  prepareChartData(): any[] {
    return [
      { Mes: 'Janeiro', Valor: 100 },
      { Mes: 'Fevereiro', Valor: 200 },
    ];
  }

  setLoadingStates(isLoading: boolean) {
    this.isLoading = {
      recordsMensal: isLoading,
      recordsAnual: isLoading,
      recordsAnualLastYear: isLoading,
      goalsMensal: isLoading,
      goalAnual: isLoading,
      lastFiveYears: isLoading,
      previousYearTotal: isLoading,
      currentYearTotal: isLoading,
      variations: isLoading
    };
  }
}