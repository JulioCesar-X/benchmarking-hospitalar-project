import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IndicatorService } from '../../core/services/indicator/indicator.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as ExcelJS from 'exceljs';
import { AuthService } from '../../core/services/auth/auth.service';
import { FilterComponent } from '../../components/shared/filter/filter.component';
import { ChartsComponent } from '../../components/charts/charts.component';
import { LoadingSpinnerComponent } from '../../components/shared/loading-spinner/loading-spinner.component';
import { Filter } from '../../core/models/filter.model';
import { MenuComponent } from '../../components/shared/menu/menu.component';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartsComponent,
    MatMenuModule,
    MatTooltipModule,
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

  tooltipVisible1: boolean = false;
  tooltipVisible2: boolean = false;

  tooltipContent1: string = `
  <div class="tooltip-content text-white p-4 rounded-md w-64 max-w-xs">
    <h2 class="text-lg font-bold mb-2">Explicação da Produção Acumulada</h2>
    <p>A produção acumulada é a soma das produções mensais ao longo do ano.</p>
    <p class="font-bold mt-2">Fórmula:</p>
    <p class="bg-gray-200 text-black p-2 rounded-md">P(A) = ∑ P(M)</p>
    <p>onde P(A) é a produção acumulada e P(M) é a produção mensal.</p>
  </div>
`;

  tooltipContent2: string = `
  <div class="tooltip-content text-white p-4 rounded-md w-64 max-w-xs">
    <h2 class="text-lg font-bold mb-2">Explicação da Variação de Produção</h2>
    <p>A variação de produção é calculada comparando a produção do período atual com a do período anterior.</p>
    <p class="font-bold mt-2">Fórmula:</p>
    <p class="bg-gray-200 text-black p-2 rounded-md">V(P) = (P(atual) - P(anterior)) / P(anterior) * 100%</p>
  </div>
`;

  private filterSubject = new Subject<Partial<Filter>>();

  constructor(
    private indicatorService: IndicatorService,
    private authService: AuthService,
    private route: ActivatedRoute
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
        console.log('Loading data with filter:', { ...this.filter, ...filter }); // Adicionando log
        return this.indicatorService.getAllData({ ...this.filter, ...filter });
      })
    ).subscribe({
      next: (data) => {
        console.log('Data received from API:', data);
        this.graphData = data;
        this.verifyAndLogGraphData();
        this.setLoadingStates(false);
        this.loadIndicatorName();
      },
      error: (error) => {
        this.setLoadingStates(false);
        console.error('Error loading graph data:', error);
      }
    });

    this.loadIndicatorName(); // Initial load
  }

  showTooltip1(): void {
    this.tooltipVisible1 = true;
  }

  hideTooltip1(): void {
    this.tooltipVisible1 = false;
  }

  showTooltip2(): void {
    this.tooltipVisible2 = true;
  }

  hideTooltip2(): void {
    this.tooltipVisible2 = false;
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
          console.log('Nome do indicador:', this.indicatorName);
          console.log('Nome do serviço:', this.serviceName);
          console.log('Nome da atividade:', this.activityName);
        },
        error: (error) => {
          console.error('Erro ao carregar o nome do indicador:', error);
        }
      });
    }
  }

  verifyAndLogGraphData(): void {
    console.log('Verifying and logging graph data...');
    console.log('recordsMensal:', this.graphData.recordsMensal);
    console.log('recordsAnual:', this.graphData.recordsAnual);
    console.log('recordsAnualLastYear:', this.graphData.recordsAnualLastYear);
    console.log('goalsMensal:', this.graphData.goalsMensal);
    console.log('goalMes:', this.graphData.goalMes);
    console.log('goalAnual:', this.graphData.goalAnual);
    console.log('previousYearTotal:', this.graphData.previousYearTotal);
    console.log('currentYearTotal:', this.graphData.currentYearTotal);
    console.log('variations:', this.graphData.variations);
  }

  exportToPdf(): void {
    const element = document.querySelector('.graphicsContainer') as HTMLElement;
    if (element) {
      console.log('Elemento .graphicsContainer encontrado.');

      // Ajustar a escala para melhorar a qualidade da imagem
      html2canvas(element, { scale: 2 }).then(canvas => {
        console.log('Canvas gerado com sucesso.');
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        let currentPdfHeight = 10;
        const pageMargin = 10;
        let srcY = 0;

        // Adicionar texto ao PDF
        pdf.setFontSize(11);
        pdf.text('Benchmarking Hospitais - Desempenho Assistencial', pdfWidth / 2, currentPdfHeight, { align: 'center' });
        currentPdfHeight += 10; // Ajustar altura após o texto
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

        // Adicionar imagem ao PDF
        const remainingHeight = canvasHeight - srcY;
        const pdfRemainingHeight = pdfHeight - currentPdfHeight - pageMargin;
        const srcHeight = Math.min(remainingHeight, (pdfRemainingHeight * canvasWidth) / pdfWidth);
        pdf.addImage(imgData, 'PNG', 0, currentPdfHeight, pdfWidth, (srcHeight * pdfWidth) / canvasWidth, undefined, 'SLOW', 0);

        console.log('Imagem adicionada ao PDF.');
        pdf.save('graficos.pdf');
        console.log('PDF salvo como graficos.pdf.');
      }).catch(error => {
        console.error('Erro ao gerar canvas:', error);
      });
    } else {
      console.error('Elemento .graphicsContainer não encontrado.');
    }
  }

  exportToExcel(): void {
    if (this.filter.year === undefined || this.filter.month === undefined) {
      console.error('Ano ou mês não está definido.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('DadosGraficos');

    // Adicionar cabeçalhos e subtítulos
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

    // Configurar colunas
    worksheet.columns = [
      { header: 'Tipo de Dado', key: 'tipo', width: 30 },
      { header: 'Departamento', key: 'departamento', width: 30 },
      { header: 'Ano', key: 'ano', width: 10 },
      { header: 'Mês', key: 'mes', width: 10 },
      { header: 'Valor', key: 'valor', width: 15 },
    ];

    // Adiciona uma linha para os cabeçalhos das colunas
    const headerRow = worksheet.addRow({
      tipo: 'Tipo de Dado',
      departamento: 'Departamento',
      ano: 'Ano',
      mes: 'Mês',
      valor: 'Valor',
    });

    // Adiciona filtro aos cabeçalhos
    worksheet.autoFilter = {
      from: 'A7',
      to: 'E7',
    };

    const departamento = 'Departamento de Psiquiatria';

    console.log('Dados do gráfico:', this.graphData);

    // Função para adicionar dados ao worksheet
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

    // Adiciona dados de produção mensal
    addDataToWorksheet(this.graphData.recordsMensal, 'Produção Mês', this.filter.year, departamento);

    // Adiciona dados de produção anual
    addDataToWorksheet(this.graphData.recordsAnual, 'Produção Acumulada', this.filter.year, departamento);

    // Adiciona dados de produção do ano anterior
    addDataToWorksheet(this.graphData.recordsAnualLastYear, 'Produção Acumulada (Ano Anterior)', this.filter.year - 1, departamento);

    // Adiciona metas mensais
    addDataToWorksheet(this.graphData.goalsMensal, 'Meta Mês', this.filter.year, departamento);

    // Adiciona meta anual
    worksheet.addRow({
      tipo: 'Meta Ano',
      departamento: departamento,
      ano: this.filter.year,
      mes: '',
      valor: this.graphData.goalAnual?.data ?? 0,
    });

    // Adiciona totais de anos anteriores e atuais
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

    // Formatação de cabeçalhos
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFB6DDE8' }
      };
    });

    // Formatação de dados
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
      window.location.href = window.location.href; // Redireciona para a mesma página
    }).catch((error) => {
      console.error('Erro ao gerar o arquivo Excel:', error);
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