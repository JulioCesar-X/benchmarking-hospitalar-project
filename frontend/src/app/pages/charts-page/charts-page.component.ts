import { Component, HostListener} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChartsComponent } from '../../components/charts/charts.component';
import { FilterComponent } from '../../components/shared/filter/filter.component';
import { Filter } from '../../core/models/filter.model';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IndicatorService } from '../../core/services/indicator/indicator.service';
import { MatMenuModule } from '@angular/material/menu';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-charts-page',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    HttpClientModule,
    ChartsComponent,
    MatMenuModule
  ],
  templateUrl: './charts-page.component.html',
  styleUrls: ['./charts-page.component.scss']
})
export class ChartsPageComponent  {
  selectedTab: string = 'Producao';

  filter: Filter = {
    indicatorId: 1,
    activityId: 1,
    serviceId: 1,
    month: new Date().getMonth() + 1,  // Current month (1-12)
    year: new Date().getFullYear()    // Current year
  };
  graphData: any;

  private filterSubject = new Subject<Partial<Filter>>();

  constructor(private indicatorService: IndicatorService) { }

  ngOnInit(): void {
    this.filterSubject.pipe(
      debounceTime(300),
      switchMap(filter => this.indicatorService.getAllInDataGraphs({ ...this.filter, ...filter }))
    ).subscribe({
      next: (data) => {
        console.log('Graph data loaded:', data);
        this.graphData = data; // Store data for children to use
      },
      error: (error) => console.error('Error loading graph data:', error)
    });

    this.loadGraphData();
  }

  loadGraphData(): void {
    this.filterSubject.next(this.filter);
  }

  handleFilterData(event: Partial<Filter>): void {
    this.filter = {
      ...this.filter,  // Preserve existing values
      ...event         // Overwrite with new values from event
    };
    console.log("Filter received in parent:", this.filter);
    this.loadGraphData();
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  toTopBtnVisible = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 200; // Change this to set a different scroll threshold
    this.toTopBtnVisible = window.scrollY > threshold;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  numberToMonth(monthNumber: number | undefined): string {
    monthNumber = 1;
    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    if (monthNumber < 1 || monthNumber > 12) {
        throw new Error("Número do mês deve estar entre 1 e 12.");
    }

    return months[monthNumber - 1];
  }

  exportToPdf(): void {
    const element = document.querySelector('.graphicsContainer') as HTMLElement;
    if (element) {
      console.log('Elemento encontrado:', element);
      html2canvas(element).then(canvas => {
        console.log('Canvas gerado:', canvas);
        const imgData = canvas.toDataURL('image/png');
        console.log('Imagem convertida:', imgData);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        console.log('Dimensões do PDF:', pdfWidth, pdfHeight);
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('graficos.pdf');
        console.log('PDF salvo');
      }).catch(error => {
        console.error('Erro ao gerar canvas:', error);
      });
    } else {
      console.error('Elemento não encontrado');
    }
  }

  exportToExcel(): void {
    const data = this.prepareChartData();
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DadosGraficos');
    XLSX.writeFile(wb, 'dados_graficos.xlsx');
  }
  
  prepareChartData(): any[] {
    // Esta função deve retornar os dados dos gráficos
    // Aqui você deve preparar os dados dos gráficos, convertendo-os para um formato de array de objetos
    // Exemplo:
    return [
      { Mes: 'Janeiro', Valor: 100 },
      { Mes: 'Fevereiro', Valor: 200 },
      // Adicione mais dados conforme necessário
    ];
  }
  

}
