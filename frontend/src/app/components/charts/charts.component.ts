import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
Chart.register(...registerables);
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-charts',
  standalone: true,
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule, MatTooltipModule]
})
export class ChartsComponent implements OnInit, OnChanges {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() graphType: string = 'bar';
  @Input() graphLabel: string = "";
  @Input() graphData: any;
  @Input() allowedChartTypes: string[] = ['bar', 'line', 'area'];
  @Input() year!: number;
  @Input() month?: number;

  private chart: Chart | null = null;
  private tooltipFixed: boolean = false;
  private fixedTooltipIndex: number | null = null;

  private chartTypeMap: { [key: string]: ChartType } = {
    bar: 'bar',
    line: 'line',
    area: 'line',
    pie: 'pie',
    doughnut: 'doughnut',
    groupedBar: 'bar',
    scatter: 'scatter'
  };

  private chartColors = {
    primary: 'rgb(81, 107, 145)',
    primaryBg: 'rgba(81, 107, 145, 0.2)',
    secondary: 'rgb(89, 196, 230)',
    secondaryBg: 'rgba(89, 196, 230, 0.2)',
    quaternary: 'rgb(147, 183, 227)',
    quaternaryBg: 'rgba(147, 183, 227, 0.2)',
    quinary: 'rgb(165, 231, 240)',
    quinaryBg: 'rgba(165, 231, 240, 0.2)',
    octonary: 'rgb(167, 208, 208)',
    octonaryBg: 'rgba(167, 208, 208, 0.2)'
  };

  constructor() { }

  ngOnInit() {
    this.initializeChart(this.graphData);
    if (this.month !== undefined) {
      this.showFixedTooltip(this.month - 1);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphData'] && changes['graphData'].currentValue !== changes['graphData'].previousValue) {
      this.initializeChart(this.graphData);
      if (this.month !== undefined) {
        this.showFixedTooltip(this.month - 1);
      }
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

    this.canvasRef.nativeElement.addEventListener('click', (event) => {
      const points = this.chart!.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
      if (points.length) {
        const point = points[0];
        if (this.tooltipFixed && this.fixedTooltipIndex === point.index) {
          this.removeTooltip();
        } else {
          this.showFixedTooltip(point.index);
        }
      }
    });
  }

  changeChartType(type: string) {
    if (this.allowedChartTypes.includes(type)) {
      this.graphType = type;
      this.initializeChart(this.graphData);
    }
  }

  getChartDataAndOptions(data: any): { chartData: ChartData, chartOptions: ChartOptions } {
    let labels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
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
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false
        }
      },
      interaction: {
        mode: 'nearest',
        intersect: true
      }
    };

    switch (this.graphType) {
      case 'bar':
        if (this.graphLabel === "Produção Mês") {
          datasets = [{
            label: 'Valor mês',
            data: data || [],
            backgroundColor: this.chartColors.primary
          }];
        } else {
          datasets = [{
            label: 'Valor mês',
            data: data || [],
            backgroundColor: this.chartColors.primary
          }];
        }
        break;

      case 'line':
        if (this.graphLabel === "Produção Mês") {
          datasets = [{
            label: 'Valor mês',
            data: data || [],
            borderColor: this.chartColors.primary,
            backgroundColor: this.chartColors.primaryBg,
            fill: false
          }];
        } else if (this.graphLabel === "Meta Mês") {
          datasets = [{
            label: 'Valor mês',
            data: data || [],
            borderColor: this.chartColors.primary,
            backgroundColor: this.chartColors.primaryBg,
            fill: false
          }];
        } else if (this.graphLabel === "Comparação produção acumulada") {
          datasets = [
            {
              label: `${this.year}`,
              data: data?.recordsAnual || [],
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              label: `${this.year - 1}`,
              data: data?.recordsAnualLastYear || [],
              borderColor: this.chartColors.secondary,
              backgroundColor: this.chartColors.secondaryBg,
              fill: false
            }
          ];
        } else if (this.graphLabel === "produção acumulada vs meta mensal") {
          datasets = [
            {
              label: 'Produção',
              data: data?.recordsAnual || [],
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              label: 'Meta',
              data: data?.goalsMensal || [],
              borderColor: this.chartColors.secondary,
              backgroundColor: this.chartColors.secondaryBg,
              fill: false
            }
          ];
        }
        break;

      case 'area':
        if (this.graphLabel === "Produção Mês") {
          datasets = [{
            label: 'Valor mês',
            data: data || [],
            borderColor: this.chartColors.primary,
            backgroundColor: this.chartColors.primaryBg,
            fill: true
          }];
        } else if (this.graphLabel === "Meta Mês") {
          datasets = [{
            label: 'Valor mês',
            data: data || [],
            borderColor: this.chartColors.primary,
            backgroundColor: this.chartColors.primaryBg,
            fill: true
          }];
        }
        break;

      case 'pie':
      case 'doughnut':
        if (this.graphLabel === "Produção Anual vs Meta Anual") {
          labels = [`Produção ${this.year}`, `Meta ${this.year}`];
          datasets = [
            {
              data: [data?.currentYearTotal || 0, data?.goalAnual || 0],
              backgroundColor: [this.chartColors.primary, this.chartColors.secondary]
            }
          ];
        } else if (this.graphLabel === "Comparação produção Total") {
          labels = [`Produção ${this.year}`, `Produção ${this.year - 1}`];
          datasets = [
            {
              data: [data?.currentYearTotal || 0, data?.previousYearTotal || 0],
              backgroundColor: [this.chartColors.primary, this.chartColors.secondary]
            }
          ];
        }
        break;

      case 'groupedBar':
        if (this.graphLabel === "produção acumulada vs meta mensal") {
          datasets = [
            {
              label: 'Produção',
              data: data?.recordsAnual || [],
              backgroundColor: this.chartColors.primary
            },
            {
              label: 'Metas',
              data: data?.goalsMensal || [],
              backgroundColor: this.chartColors.secondary
            }
          ];
        } else if (this.graphLabel === "Comparação produção acumulada") {
          datasets = [
            {
              label: `${this.year}`,
              data: data?.recordsAnual || [],
              backgroundColor: this.chartColors.primary,
            },
            {
              label: `${this.year - 1}`,
              data: data?.recordsAnualLastYear || [],
              backgroundColor: this.chartColors.secondary,
            }
          ];
        }
        break;

      case 'scatter':
        if (this.graphLabel === "Comparação produção acumulada") {
          datasets = [
            {
              type: 'line',
              label: `${this.year}`,
              data: data?.recordsAnual || [],
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              type: 'bar',
              label: `${this.year - 1}`,
              data: data?.recordsAnualLastYear || [],
              borderColor: this.chartColors.secondaryBg,
              backgroundColor: this.chartColors.secondary,
              fill: false
            }
          ];
        } else if (this.graphLabel === "produção acumulada vs meta mensal") {
          datasets = [
            {
              type: 'line',
              label: 'Produção',
              data: data?.recordsAnual || [],
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              type: 'bar',
              label: 'Meta',
              data: data?.goalsMensal || [],
              borderColor: this.chartColors.secondaryBg,
              backgroundColor: this.chartColors.secondary,
              fill: false
            }
          ];
        }
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

  getChartTypeName(type: string): string {
    const names: { [key: string]: string } = {
      bar: 'Barra',
      line: 'Linha',
      area: 'Área',
      pie: 'Pizza',
      doughnut: 'Rosquinha',
      groupedBar: 'Barra Agrupada',
      scatter: 'Dispersão'
    };
    return names[type] || type;
  }

  showFixedTooltip(monthIndex: number) {
    if (this.chart && this.chart.tooltip) {
      const datasetIndex = 0;
      const meta = this.chart.getDatasetMeta(datasetIndex);
      const point = meta.data[monthIndex];

      if (point) {
        const eventPosition = {
          x: point.x,
          y: point.y
        };

        // Set the active elements and the event position for the tooltip
        this.chart.tooltip.setActiveElements([{ datasetIndex, index: monthIndex }], eventPosition);

        // Manually update the tooltip
        this.chart.update();

        this.tooltipFixed = true;
        this.fixedTooltipIndex = monthIndex;
      }
    }
  }

  removeTooltip() {
    if (this.chart && this.chart.tooltip) {
      this.chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      this.chart.update();
      this.tooltipFixed = false;
      this.fixedTooltipIndex = null;
    }
  }
}