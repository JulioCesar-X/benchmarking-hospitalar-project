import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatTooltipModule]
})
export class ChartsComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() graphType: string = 'bar';
  @Input() graphLabel: string = "";
  @Input() graphData: any;

  private chart: Chart | null = null;

  private chartTypeMap: { [key: string]: ChartType } = {
    bar: 'bar',
    line: 'line',
    pie: 'pie',
    doughnut: 'doughnut',
    groupedBar: 'bar',
    scatter: 'scatter'
  };

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
      type: this.chartTypeMap[this.graphType] || 'bar',
      data: chartData,
      options: chartOptions
    });
  }

  changeChartType(type: string) {
    this.graphType = this.chartTypeMap[type] || 'bar';
    this.initializeChart(this.graphData);
  }

  getChartDataAndOptions(data: any): { chartData: ChartData, chartOptions: ChartOptions } {
    let labels: string[] = [];
    let datasets: any[] = [];
    let chartOptions: ChartOptions = {
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
    };

    switch (this.graphType) {
      case 'bar':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasets = [{
          label: this.graphLabel,
          data: data || [],
          backgroundColor: '#516b91'
        }];
        break;
      case 'line':
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
      case 'pie':
      case 'doughnut':
        labels = ['Meta ano', 'Produção ano'];
        datasets = [
          {
            label: ['Meta ano', 'Produção ano'],
            data: [data?.goalAnual || 0, data?.currentYearTotal || 0],
            backgroundColor: ['#59c4e6', '#516b91']
          }
        ];
        break;
      case 'groupedBar':
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
      case 'scatter':
        labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        datasets = [
          {
            type: 'line',
            label: 'Ano Atual',
            data: data?.recordsAnual || [],
            borderColor: '#516b91',
            backgroundColor: 'rgba(81,107,145,0.2)',
            fill: false
          },
          {
            type: 'bar',
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
      chartOptions: chartOptions
    };
  }
}