import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart, { ChartType, ChartData, ChartOptions } from 'chart.js/auto';
import { IndicatorService } from '../../core/services/indicator/indicator.service';
import { Filter } from '../../core/models/filter.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input({ required: true }) filter: Filter = { serviceId: 0, activityId: 0, indicatorId: 0, month: 0, year: 0 };
  @Input({ required: true }) graphType: string = "";
  @Input({ required: true }) graphLabel: string = "";

  private chart: Chart | null = null;

  constructor(private indicatorService: IndicatorService) { }

  ngOnInit() {
    // this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && changes['filter'].currentValue !== changes['filter'].previousValue) {
      console.log('Filter changed:', this.filter);
      // this.loadData();
    }
  }

  loadData() {
    forkJoin({
      data: this.indicatorService.getAllInDataGraphs(this.filter)
    }).subscribe({
      next: ({ data }) => {
        console.log('Chart data loaded:', data);
        this.initializeChart(data);
      },
      error: (error) => console.error('Error loading chart data:', error)
    });
  }

  initializeChart(data: any) {
    const { chartData, chartOptions } = this.getChartDataAndOptions(data);
    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart instance if exists
    }
    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.getChartType(),
      data: chartData,
      options: chartOptions
    });
  }

  getChartDataAndOptions(data: any): { chartData: ChartData, chartOptions: ChartOptions } {
    let labels: string[] = [];
    let datasetData: number[] = [];

    switch (this.graphType) {
      case 'month':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasetData = data.recordsMensal;
        break;
      case 'year':
        labels = data.years;
        datasetData = data.recordsAnual;
        break;
      case 'homologYear':
        labels = ['Previous Year', 'Current Year'];
        datasetData = [data.previousYearTotal, data.currentYearTotal];
        break;
      case 'fiveYear':
        labels = data.lastFiveYears.map((yr: any) => yr.year);
        datasetData = data.lastFiveYears.map((yr: any) => yr.total);
        break;
      case 'lineChart':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        if (this.graphLabel === 'Variação currentYear') {
          datasetData = data.recordsMensal; // Assumindo que data.recordsMensal contém os dados para o gráfico de linha do ano atual
        } else if (this.graphLabel === 'Variação previousYear') {
          datasetData = data.recordsMensal; // Ajustar conforme necessário para os dados do ano anterior
        }
        break;
      default:
        break;
    }

    return {
      chartData: {
        labels: labels,
        datasets: [{
          label: this.graphLabel,
          data: datasetData,
          backgroundColor: '#D2E8ED',
          borderColor: '#9CCCDE',
          borderWidth: 1
        }]
      },
      chartOptions: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  getChartType(): ChartType {
    return this.graphType === 'lineChart' ? 'line' : 'bar';
  }
}
