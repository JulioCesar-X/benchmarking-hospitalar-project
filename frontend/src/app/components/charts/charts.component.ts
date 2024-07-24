import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Chart, ChartType, ChartData, ChartOptions, registerables } from 'chart.js';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { debounce } from 'lodash';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  imports: [MatMenuModule, MatIconModule, MatButtonModule, CommonModule, MatTooltipModule, MatCheckboxModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    octonaryBg: 'rgba(167, 208, 208, 0.2)',
    red: 'rgb(218, 65, 103)',
    redBg: 'rgba(255, 0, 0, 0.2)',
  };

  constructor() {
    this.changeChartType = debounce(this.changeChartType.bind(this), 300); // Debounce to prevent rapid calls
  }

  ngOnInit() {
    this.initializeChart(this.graphData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphData'] && changes['graphData'].currentValue !== changes['graphData'].previousValue) {
      console.log('Updating chart with new data:', changes['graphData'].currentValue); // Adicione este log
      this.updateChart(this.graphData);
    }
  }

  initializeChart(data: any) {
    if (!data) {
      return;
    }
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

  updateChart(data: any) {
    if (!data) {
      return;
    }
    if (this.chart) {
      const { chartData, chartOptions } = this.getChartDataAndOptions(data);
      this.chart.data = chartData;
      this.chart.options = chartOptions;
      this.chart.update();
    }
  }

  changeChartType(type: string) {
    if (this.allowedChartTypes.includes(type)) {
      this.graphType = type;
      this.initializeChart(this.graphData); // Reinitialize chart to apply new type
    }
  }

  getChartDataAndOptions(data: any): { chartData: ChartData, chartOptions: ChartOptions } {
    const highlightMonth = this.month !== undefined ? this.month - 1 : -1;
    let labels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    let datasets: any[] = [];
    let chartOptions: ChartOptions = {
      maintainAspectRatio: false,
      animation: {
        duration: 300, // Adjust animation duration for smooth transitions
      },
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

    const defaultBackgroundColor = 'rgba(81, 107, 145, 0.5)';
    const defaultBackgroundColor2Bar1 = 'rgba(81, 107, 145, 0.3)';
    const defaultBackgroundColor2Bar2 = 'rgba(89, 196, 230, 0.3)';
    const defaultBackgroundColor2BarRed2 = 'rgba(255, 0, 0, 0.3)';
    const highlightBackgroundColor = this.chartColors.primary;
    const highlightBackgroundColor2Bar1 = this.chartColors.primary;
    const highlightBackgroundColor2Bar2 = this.chartColors.secondary;
    const highlightBackgroundColorRed = this.chartColors.red;

    const fillDataArray = (dataObj: any) => {
      const filledArray = Array(12).fill(0);
      if (dataObj && dataObj.hasData) {
        Object.entries(dataObj.data).forEach(([month, value]: any) => {
          filledArray[parseInt(month, 10) - 1] = value;
        });
      }
      return filledArray;
    };

    switch (this.graphType) {
      case 'bar':
        if (this.graphLabel === "Produção Mês") {
          datasets = [
            {
              label: 'Meta Mensal',
              type: 'line',
              data: fillDataArray(data[1]),
              borderColor: this.chartColors.red,
              backgroundColor: this.chartColors.redBg,
            },
            {
              label: 'Valor mês',
              data: fillDataArray(data[0]),
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColor : defaultBackgroundColor;
              }
            }
          ];
        } else {
          datasets = [
            {
              label: 'Valor mês',
              data: fillDataArray(data),
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColorRed : defaultBackgroundColor2BarRed2;
              }
            }
          ];
        }
        break;

      case 'line':
        if (this.graphLabel === "Produção Mês") {
          datasets = [
            {
              label: 'Meta Mensal',
              type: 'line',
              data: fillDataArray(data[1]),
              borderColor: this.chartColors.red,
              backgroundColor: this.chartColors.redBg,
            },
            {
              label: 'Valor mês',
              data: fillDataArray(data[0]),
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            }
          ];
        } else if (this.graphLabel === "Meta Mês") {
          datasets = [{
            label: 'Valor mês',
            data: fillDataArray(data),
            borderColor: this.chartColors.red,
            backgroundColor: this.chartColors.redBg,
            fill: false
          }];
        } else if (this.graphLabel === "Comparação produção acumulada") {
          datasets = [
            {
              label: `${this.year}`,
              data: fillDataArray(data.recordsAnual),
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              label: `${this.year - 1}`,
              data: fillDataArray(data.recordsAnualLastYear),
              borderColor: this.chartColors.secondary,
              backgroundColor: this.chartColors.secondaryBg,
              fill: false
            }
          ];
        } else if (this.graphLabel === "produção acumulada vs meta mensal") {
          datasets = [
            {
              label: 'Produção',
              data: fillDataArray(data.recordsAnual),
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              label: 'Meta',
              data: fillDataArray(data.goalsMensal),
              borderColor: this.chartColors.red,
              backgroundColor: this.chartColors.redBg,
              fill: false
            }
          ];
        }
        break;

      case 'area':
        if (this.graphLabel === "Produção Mês") {
          datasets = [
            {
              label: 'Meta Mensal',
              type: 'line',
              data: fillDataArray(data[1]),
              borderColor: this.chartColors.red,
              backgroundColor: this.chartColors.redBg,
            },
            {
              label: 'Valor mês',
              data: fillDataArray(data[0]),
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: true
            }
          ];
        } else if (this.graphLabel === "Meta Mês") {
          datasets = [
            {
              label: 'Valor mês',
              data: fillDataArray(data),
              borderColor: this.chartColors.red,
              backgroundColor: this.chartColors.redBg,
              fill: true
            }
          ];
        }
        break;

      case 'pie':
      case 'doughnut':
        if (this.graphLabel === "Produção Anual vs Meta Anual") {
          labels = [`Produção ${this.year}`, `Meta ${this.year}`];
          datasets = [
            {
              data: [
                data.currentYearTotal && data.currentYearTotal.hasData ? data.currentYearTotal.data : 0,
                data.goalAnual && data.goalAnual.hasData ? data.goalAnual.data : 0
              ],
              backgroundColor: [this.chartColors.primary, this.chartColors.red]
            }
          ];
        } else if (this.graphLabel === "Comparação produção Total") {
          labels = [`Produção ${this.year}`, `Produção ${this.year - 1}`];
          datasets = [
            {
              data: [
                data.currentYearTotal && data.currentYearTotal.hasData ? data.currentYearTotal.data : 0,
                data.previousYearTotal && data.previousYearTotal.hasData ? data.previousYearTotal.data : 0
              ],
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
              data: fillDataArray(data.recordsAnual),
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColor2Bar1 : defaultBackgroundColor2Bar1;
              }
            },
            {
              label: 'Metas',
              data: fillDataArray(data.goalsMensal),
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColorRed : defaultBackgroundColor2BarRed2;
              }
            }
          ];
        } else if (this.graphLabel === "Comparação produção acumulada") {
          datasets = [
            {
              label: `${this.year}`,
              data: fillDataArray(data.recordsAnual),
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColor2Bar1 : defaultBackgroundColor2Bar1;
              }
            },
            {
              label: `${this.year - 1}`,
              data: fillDataArray(data.recordsAnualLastYear),
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColor2Bar2 : defaultBackgroundColor2Bar2;
              }
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
              data: fillDataArray(data.recordsAnual),
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              type: 'bar',
              label: `${this.year - 1}`,
              data: fillDataArray(data.recordsAnualLastYear),
              borderColor: this.chartColors.secondaryBg,
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColor2Bar2 : defaultBackgroundColor2Bar2;
              },
              fill: false
            }
          ];
        } else if (this.graphLabel === "produção acumulada vs meta mensal") {
          datasets = [
            {
              type: 'line',
              label: 'Produção',
              data: fillDataArray(data.recordsAnual),
              borderColor: this.chartColors.primary,
              backgroundColor: this.chartColors.primaryBg,
              fill: false
            },
            {
              type: 'bar',
              label: 'Meta',
              data: fillDataArray(data.goalsMensal),
              borderColor: this.chartColors.secondaryBg,
              backgroundColor: (ctx: any) => {
                const index = ctx.dataIndex;
                return index === highlightMonth ? highlightBackgroundColorRed : defaultBackgroundColor2BarRed2;
              },
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

  toggleMetaMensal(show: boolean) {
    if (this.graphLabel !== 'Produção Mês') return; // Ensure this only applies to "Produção Mês"
    const metaDataset = this.chart?.data.datasets.find(dataset => dataset.label === 'Meta Mensal');
    if (metaDataset) {
      metaDataset.hidden = !show;
      this.chart?.update();
    }
  }
}