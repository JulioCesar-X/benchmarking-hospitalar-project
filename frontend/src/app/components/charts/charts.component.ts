import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart, { ChartType, ChartData, ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-charts',
  standalone: true,
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() graphType: string = "";
  @Input() graphLabel: string = "";
  @Input() graphData: any;

  private chart: Chart | null = null;

  constructor() { }

  ngOnInit() {
    this.initializeChart(this.graphData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphData'] && changes['graphData'].currentValue !== changes['graphData'].previousValue) {
      console.log('Graph data changed:', this.graphData);
      this.initializeChart(this.graphData);
    }
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
        datasetData = data?.recordsMensal || [];
        break;
      case 'month-metas':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasetData = data?.goalsMensal || [];
        break;
      case 'year-metas':
        labels = data?.years || [];
        datasetData = data?.goalAnual || [];
        break;
      case 'homologYear':
        labels = ['Ano anterior', 'Ano atual'];
        datasetData = [
          data?.previousYearTotal ?? 0,
          data?.currentYearTotal ?? 0
        ];
        break;
      case 'fiveYear':
        labels = data?.lastFiveYears?.map((yr: any) => yr.year) || [];
        datasetData = data?.lastFiveYears?.map((yr: any) => yr.total) || [];
        break;
      case 'lineChart':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        if (this.graphLabel === 'Ano atual') {
          datasetData = data?.recordsAnual || [];
        } else if (this.graphLabel === 'Ano anterior') {
          datasetData = data?.recordsAnualLastYear || [];
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