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
import { ChartsComponent } from '../../components/charts/charts.component';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner/loading-spinner.component';
import { Filter } from '../../core/models/filter.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenuComponent } from '../../components/shared/menu/menu.component';
import { LoggingService } from '../../core/services/logging.service';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartsComponent,
    MatMenuModule,
    LoadingSpinnerComponent,
    MatIconModule,
    MatButtonModule,
    MenuComponent,
  ],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss']
})
export class ChartsPageComponent implements OnInit {
  selectedTab: string = 'Producao';
  filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  };
  graphData: any = {};
  isLoading: any = {};
  isAdminOrCoordinator: boolean = false;
  showActivityInput: boolean = false;
  indicatorName: string = '';
  serviceName?: string = '';
  activityName?: string = '';

  private filterSubject = new Subject<Partial<Filter>>();

  constructor(
    private indicatorService: IndicatorService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    const role = this.authService.getRole();
    this.isAdminOrCoordinator = role === 'admin' || role === 'coordenador';

    const resolvedData = this.route.snapshot.data['chartData'];
    if (resolvedData) {
      this.graphData = resolvedData.data;
      this.filter = resolvedData.filter;
    }

    this.route.params.subscribe(params => {
      const serviceId = +params['serviceId'];
      if (serviceId) {
        this.filter.serviceId = serviceId;
        this.loadGraphData();
      }
    });

    this.filterSubject.pipe(
      debounceTime(300),
      switchMap(filter => {
        this.setLoadingStates(true);
        this.loggingService.log('Loading data with filter:', { ...this.filter, ...filter });
        return this.indicatorService.getAllData({ ...this.filter, ...filter });
      })
    ).subscribe({
      next: (data) => {
        this.loggingService.log('Data received from API:', data);
        this.graphData = data;
        this.verifyAndLogGraphData();
        this.setLoadingStates(false);
        this.loadIndicatorName();
      },
      error: (error) => {
        this.setLoadingStates(false);
        this.loggingService.error('Error loading graph data:', error);
      }
    });

    this.loadIndicatorName();
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

  getRole() {
    return this.authService.getRole();
  }

  numberToMonth(monthNumber: number | undefined): string {
    const months = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    if (monthNumber === undefined || monthNumber < 1 || monthNumber > 12) {
      throw new Error("Número do mês deve estar entre 1 e 12.");
    }

    return months[monthNumber - 1];
  }

  loadIndicatorName(): void {
    if (this.filter.indicatorId !== undefined) {
      this.indicatorService.showIndicator(Number(this.filter.indicatorId)).subscribe({
        next: (name) => {
          this.indicatorName = name.indicator_name;
          const service = name.sais?.find((sai: any) => sai.service?.id === this.filter.serviceId)?.service;
          const activity = name.sais?.find((sai: any) => sai.activity?.id === this.filter.activityId)?.activity;
          this.serviceName = service?.service_name;
          this.activityName = activity?.activity_name || 'N/A';
          this.loggingService.log('Nome do indicador:', this.indicatorName);
          this.loggingService.log('Nome do serviço:', this.serviceName);
          this.loggingService.log('Nome da atividade:', this.activityName);
        },
        error: (error) => {
          this.loggingService.error('Erro ao carregar o nome do indicador:', error);
        }
      });
    }
  }

  verifyAndLogGraphData(): void {
    this.loggingService.log('Verifying and logging graph data...');
    this.loggingService.log('recordsMensal:', this.graphData.recordsMensal);
    this.loggingService.log('recordsAnual:', this.graphData.recordsAnual);
    this.loggingService.log('recordsAnualLastYear:', this.graphData.recordsAnualLastYear);
    this.loggingService.log('goalsMensal:', this.graphData.goalsMensal);
    this.loggingService.log('goalMes:', this.graphData.goalMes);
    this.loggingService.log('goalAnual:', this.graphData.goalAnual);
    this.loggingService.log('previousYearTotal:', this.graphData.previousYearTotal);
    this.loggingService.log('currentYearTotal:', this.graphData.currentYearTotal);
    this.loggingService.log('variations:', this.graphData.variations);
  }

  exportToPdf(): void {
    const element = document.querySelector('.graphicsContainer') as HTMLElement;
    if (element) {
      this.loggingService.log('Elemento .graphicsContainer encontrado.');

      html2canvas(element, { scale: 2 }).then(canvas => {
        this.loggingService.log('Canvas gerado com sucesso.');
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        let currentPdfHeight = 10;
        const pageMargin = 10;
        let srcY = 0;

        pdf.setFontSize(11);
        pdf.text('Benchmarking Hospitais - Desempenho Assistencial', pdfWidth / 2, currentPdfHeight, { align: 'center' });
        currentPdfHeight += 10;
        pdf.setFontSize(9);
        pdf.text(`Serviço: ${this.serviceName || 'N/A'}`, pageMargin, currentPdfHeight);
        currentPdfHeight += 10;
        pdf.text(`Atividade: ${this.activityName || 'N/A'}`, pageMargin, currentPdfHeight);
        currentPdfHeight += 10;
        pdf.text(`Indicador: ${this.indicatorName || 'N/A'}`, pageMargin, currentPdfHeight);
        currentPdfHeight += 10;
        pdf.text(`Tempo: ${this.filter.year}${(this.filter.month ?? 0).toString().padStart(2, '0')}`, pageMargin, currentPdfHeight);
        currentPdfHeight += 10;
        pdf.text('Dados publicados a:', pageMargin, currentPdfHeight);
        pdf.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageMargin, currentPdfHeight + 10);
        currentPdfHeight += 20;

        const remainingHeight = canvasHeight - srcY;
        const pdfRemainingHeight = pdfHeight - currentPdfHeight - pageMargin;
        const srcHeight = Math.min(remainingHeight, (pdfRemainingHeight * canvasWidth) / pdfWidth);
        pdf.addImage(imgData, 'PNG', 0, currentPdfHeight, pdfWidth, (srcHeight * pdfWidth) / canvasWidth, undefined, 'SLOW', 0);

        this.loggingService.log('Imagem adicionada ao PDF.');
        pdf.save('graficos.pdf');
        this.loggingService.log('PDF salvo como graficos.pdf.');
      }).catch(error => {
        this.loggingService.error('Erro ao gerar canvas:', error);
      });
    } else {
      this.loggingService.error('Elemento .graphicsContainer não encontrado.');
    }
  }

  exportToExcel(): void {
    if (this.filter.year === undefined || this.filter.month === undefined) {
      this.loggingService.error('Ano ou mês não está definido.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DadosGraficos');

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `Dados publicados a ${this.filter.year}${(this.filter.month ?? 0).toString()}`;
    worksheet.getCell('A1').font = { bold: true };

    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = `Serviço: ${this.serviceName}`;
    worksheet.getCell('A2').font = { bold: true };

    worksheet.mergeCells('A3:F3');
    worksheet.getCell('A3').value = `Atividade: ${this.activityName}`;
    worksheet.getCell('A3').font = { bold: true };

    worksheet.mergeCells('A4:F4');
    worksheet.getCell('A4').value = `Indicador: ${this.indicatorName}`;
    worksheet.getCell('A4').font = { bold: true };

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = currentDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    worksheet.mergeCells('A5:F5');
    worksheet.getCell('A5').value = `Data: ${formattedDate} ${formattedTime}`;
    worksheet.getCell('A5').font = { bold: true };
    worksheet.mergeCells('A6:F6');
    worksheet.getCell('A6').value = '(Valores acumulados)';
    worksheet.getCell('A6').font = { bold: true };

    worksheet.columns = [
      { header: 'Tipo de Dado', key: 'tipo', width: 30 },
      { header: 'Departamento', key: 'departamento', width: 30 },
      { header: 'Ano', key: 'ano', width: 10 },
      { header: 'Mês', key: 'mes', width: 10 },
      { header: 'Valor', key: 'valor', width: 15 },
    ];

    const headerRow = worksheet.addRow({
      tipo: 'Tipo de Dado',
      departamento: 'Departamento',
      ano: 'Ano',
      mes: 'Mês',
      valor: 'Valor',
    });

    worksheet.autoFilter = {
      from: 'A7',
      to: 'E7',
    };

    const departamento = 'Departamento de Psiquiatria';

    this.loggingService.log('Dados do gráfico:', this.graphData);

    const addDataToWorksheet = (dataObj: any, tipo: string, ano: number, departamento: string) => {
      if (dataObj && dataObj.data) {
        Object.keys(dataObj.data).forEach((key) => {
          worksheet.addRow({
            tipo: tipo,
            departamento: departamento,
            ano: ano,
            mes: key,
            valor: dataObj.data[key],
          });
        });
      }
    };

    addDataToWorksheet(this.graphData.recordsMensal, 'Produção Mês', this.filter.year, departamento);
    addDataToWorksheet(this.graphData.recordsAnual, 'Produção Acumulada', this.filter.year, departamento);
    addDataToWorksheet(this.graphData.recordsAnualLastYear, 'Produção Acumulada (Ano Anterior)', this.filter.year - 1, departamento);
    addDataToWorksheet(this.graphData.goalsMensal, 'Meta Mês', this.filter.year, departamento);

    worksheet.addRow({
      tipo: 'Meta Ano',
      departamento: departamento,
      ano: this.filter.year,
      mes: '',
      valor: this.graphData.goalAnual?.data ?? 0,
    });

    worksheet.addRow({
      tipo: 'Total Ano Anterior',
      departamento: departamento,
      ano: this.filter.year - 1,
      mes: '',
      valor: this.graphData.previousYearTotal?.data ?? 0,
    });
    worksheet.addRow({
      tipo: 'Total Ano Atual',
      departamento: departamento,
      ano: this.filter.year,
      mes: '',
      valor: this.graphData.currentYearTotal?.data ?? 0,
    });

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB6DDE8' }
      };
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 7) {
        row.eachCell((cell) => {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });
      }
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dados_graficos.xlsx';
      a.click();
      window.location.href = window.location.href;
    }).catch((error) => {
      this.loggingService.error('Erro ao gerar o arquivo Excel:', error);
    });
  }

  setLoadingStates(value: boolean): void {
    this.isLoading = {
      recordsMensal: value,
      recordsAnual: value,
      recordsAnualLastYear: value,
      goalsMensal: value,
      goalMes: value,
      goalAnual: value,
      lastFiveYears: value,
      previousYearTotal: value,
      currentYearTotal: value,
      variations: value
    };
  }
}