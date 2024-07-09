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
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MenuComponent
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
  indicatorName: string = '';
  serviceName?: string = '';
  activityName?: string = '';

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
        console.log('Dados do gráfico:', this.graphData);
        this.setLoadingStates(false);
        this.loadIndicatorName();
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

  exportToPdf(): void {
    const element = document.querySelector('.graphicsContainer') as HTMLElement;
    if (element) {
      console.log('Elemento .graphicsContainer encontrado.');
      html2canvas(element).then(canvas => {
        console.log('Canvas gerado com sucesso.');
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Variables to track the current height on the PDF and the current position on the canvas
        let currentPdfHeight = 80; // Start after the header
        let srcY = 0;

        // Add header information only on the first page
        pdf.setFontSize(11);
        pdf.text('Benchmarking Hospitais - Desempenho Assistencial', pdfWidth / 2, 10, { align: 'center' });
        pdf.setFontSize(9);
        pdf.text(`Serviço: ${this.serviceName || 'N/A'}`, 10, 20);
        pdf.text(`Atividade: ${this.activityName || 'N/A'}`, 10, 30);
        pdf.text(`Indicador: ${this.indicatorName || 'N/A'}`, 10, 40);
        pdf.text(`Tempo: ${this.filter.year}${(this.filter.month ?? 0).toString().padStart(2, '0')}`, 10, 50);
        pdf.text('Dados publicados a:', 10, 60);
        pdf.text(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 10, 70);

        const remainingHeight = canvasHeight - srcY;
        const pdfRemainingHeight = pdfHeight - currentPdfHeight;
        const srcHeight = Math.min(remainingHeight, (pdfRemainingHeight * canvasWidth) / pdfWidth);
        pdf.addImage(imgData, 'PNG', 0, currentPdfHeight, pdfWidth, (srcHeight * pdfWidth) / canvasWidth, undefined, 'FAST', 0);


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

    //Adicionar cabeçalhos e subtítulos
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

    worksheet.mergeCells('A5:F5');
    worksheet.getCell('A5').value = `Tempo: ${this.filter.year}${(this.filter.month ?? 0).toString().padStart(2, '0')}`;
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
    worksheet.addRow({
      tipo: 'Tipo de Dado',
      departamento: 'Departamento',
      ano: 'Ano',
      mes: 'Mês',
      valor: 'Valor',
    });

    // Exemplo de dados para Departamento
    const departamento = 'Departamento de Psiquiatria';

    // Adiciona dados de produção mensal
    (this.graphData.recordsMensal || []).forEach((value: number, index: number) => {
      worksheet.addRow({ tipo: 'Produção Mês', departamento, ano: this.filter.year, mes: index + 1, valor: value, indice: 1 });
    });

    // Adiciona dados de produção anual
    (this.graphData.recordsAnual || []).forEach((value: number, index: number) => {
      worksheet.addRow({ tipo: 'Produção Acumulada', departamento, ano: this.filter.year, mes: index + 1, valor: value, indice: 1 });
    });

    // Adiciona dados de produção do ano anterior
    (this.graphData.recordsAnualLastYear || []).forEach((value: number, index: number) => {
      worksheet.addRow({ tipo: 'Produção Acumulada (Ano Anterior)', departamento, ano: (this.filter.year ?? 0) - 1, mes: index + 1, valor: value, indice: 1 });
    });

    // Adiciona metas mensais
    (this.graphData.goalsMensal || []).forEach((value: number, index: number) => {
      worksheet.addRow({ tipo: 'Meta Mês', departamento, ano: this.filter.year, mes: index + 1, valor: value, indice: 1 });
    });

    // Adiciona meta anual
    worksheet.addRow({ tipo: 'Meta Ano', departamento, ano: this.filter.year, mes: '', valor: this.graphData.goalAnual ?? 0, indice: 1 });

    // Adiciona dados dos últimos cinco anos
    (this.graphData.lastFiveYears || []).forEach((item: any) => {
      worksheet.addRow({ tipo: 'Produção Últimos 5 Anos', departamento, ano: item.year, mes: '', valor: item.total, indice: 1 });
    });

    // Adiciona totais de anos anteriores e atuais
    worksheet.addRow({ tipo: 'Total Ano Anterior', departamento, ano: (this.filter.year ?? 0) - 1, mes: '', valor: this.graphData.previousYearTotal ?? 0, indice: 1 });
    worksheet.addRow({ tipo: 'Total Ano Atual', departamento, ano: this.filter.year, mes: '', valor: this.graphData.currentYearTotal ?? 0, indice: 1 });

    // Formatação de cabeçalhos
    const headerRow = worksheet.getRow(7);
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
      // window.URL.revokeObjectURL(url);
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
      goalAnual: value,
      lastFiveYears: value,
      previousYearTotal: value,
      currentYearTotal: value,
      variations: value
    };
  }
}
