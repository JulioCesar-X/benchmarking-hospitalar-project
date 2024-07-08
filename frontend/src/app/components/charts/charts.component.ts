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
    let datasets: any[] = [];

    switch (this.graphType) {
      case 'month':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasets = [{
          label: this.graphLabel,
          data: data || [],
          backgroundColor: '#516b91'
        }];
        break;
      case 'stackedBar':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasets = [
          {
            label: 'Produção',
            data: data?.recordsAnual || [],
            backgroundColor: '#516b91'
          },
          {
            label: 'Metas',
            data: data?.goalsMensal || [],
            backgroundColor: '#59c4e6'
          }
        ];
        break;
      case 'barComparison':
        labels = ['Ano anterior', 'Ano atual'];
        datasets = [
          {
            label: 'Produção Total',
            data: [data?.previousYearTotal || 0, data?.currentYearTotal || 0],
            backgroundColor: ['#59c4e6','#516b91']
          }
        ];
        break;
      case 'pieChart':
        labels = ['Meta ano', 'Produção ano'];
        datasets = [
          {
            label: ['Meta ano', 'Produção ano'],
            data: [data?.goalAnual || 0, data?.currentYearTotal || 0],
            backgroundColor: ['#59c4e6', '#516b91']
          }
        ];
        break;
      case 'lineChart':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasets = [
          {
            label: 'Ano Atual',
            data: data?.recordsAnual || [],
            borderColor: '#516b91',
            backgroundColor: 'rgba(81,107,145,0.2)',
            fill: false
          },
          {
            label: 'Ano Anterior',
            data: data?.recordsAnualLastYear || [],
            borderColor: '#59c4e6',
            backgroundColor: 'rgba(89,196,230,0.2)',
            fill: false
          }
        ];
        break;
      default:
        break;
    }

    return {
      chartData: {
        labels: labels,
        datasets: datasets
      },
      chartOptions: {
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          title: {
            display: true,
            text: this.graphLabel
          }
        }
      }
    };
  }

  getChartType(): ChartType {
    if (this.graphType === 'lineChart') {
      return 'line';
    } else if (this.graphType === 'stackedBar' || this.graphType === 'month' || this.graphType === 'barComparison') {
      return 'bar';
    } else if (this.graphType === 'pieChart') {
      return 'pie';
    }
    return 'bar';
  }
}