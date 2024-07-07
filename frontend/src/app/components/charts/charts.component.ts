import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() graphType: string = "";
  @Input() graphLabel: string = "";
  @Input() graphData: any;
  chartInstance: any;

  ngOnInit() {
    this.loadTheme();
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['graphData'] && !changes['graphData'].isFirstChange()) {
      this.updateChart();
    }
  }

  loadTheme() {
    const themeData = {
      "color": [
        "#FFFFFF",
        "#59c4e6",
        "#edafda",
        "#93b7e3",
        "#a5e7f0",
        "#cbb0e3"
      ],
      "backgroundColor": "#FFFFFF",
      "textStyle": {},
      "title": {
        "textStyle": {
          "color": "#FFFFFF"
        },
        "subtextStyle": {
          "color": "#93b7e3"
        }
      },
      "line": {
        "itemStyle": {
          "borderWidth": "2"
        },
        "lineStyle": {
          "width": "2"
        },
        "symbolSize": "6",
        "symbol": "emptyCircle",
        "smooth": true
      },
      "radar": {
        "itemStyle": {
          "borderWidth": "2"
        },
        "lineStyle": {
          "width": "2"
        },
        "symbolSize": "6",
        "symbol": "emptyCircle",
        "smooth": true
      },
      "bar": {
        "itemStyle": {
          "barBorderWidth": 0,
          "barBorderColor": "#ccc"
        }
      },
      "pie": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "scatter": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "boxplot": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "parallel": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "sankey": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "funnel": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "gauge": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        }
      },
      "candlestick": {
        "itemStyle": {
          "color": "#edafda",
          "color0": "transparent",
          "borderColor": "#d680bc",
          "borderColor0": "#8fd3e8",
          "borderWidth": "2"
        }
      },
      "graph": {
        "itemStyle": {
          "borderWidth": 0,
          "borderColor": "#ccc"
        },
        "lineStyle": {
          "width": 1,
          "color": "#aaa"
        },
        "symbolSize": "6",
        "symbol": "emptyCircle",
        "smooth": true,
        "color": [
          "#FFFFFF",
          "#59c4e6",
          "#edafda",
          "#93b7e3",
          "#a5e7f0",
          "#cbb0e3"
        ],
        "label": {
          "color": "#eee"
        }
      },
      "map": {
        "itemStyle": {
          "areaColor": "#f3f3f3",
          "borderColor": "#FFFFFF",
          "borderWidth": 0.5
        },
        "label": {
          "color": "#000"
        },
        "emphasis": {
          "itemStyle": {
            "areaColor": "#a5e7f0",
            "borderColor": "#FFFFFF",
            "borderWidth": 1
          },
          "label": {
            "color": "#FFFFFF"
          }
        }
      },
      "geo": {
        "itemStyle": {
          "areaColor": "#f3f3f3",
          "borderColor": "#FFFFFF",
          "borderWidth": 0.5
        },
        "label": {
          "color": "#000"
        },
        "emphasis": {
          "itemStyle": {
            "areaColor": "#a5e7f0",
            "borderColor": "#FFFFFF",
            "borderWidth": 1
          },
          "label": {
            "color": "#FFFFFF"
          }
        }
      },
      "categoryAxis": {
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#cccccc"
          }
        },
        "axisTick": {
          "show": false,
          "lineStyle": {
            "color": "#333"
          }
        },
        "axisLabel": {
          "show": true,
          "color": "#999999"
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": [
              "#eeeeee"
            ]
          }
        },
        "splitArea": {
          "show": false,
          "areaStyle": {
            "color": [
              "rgba(250,250,250,0.05)",
              "rgba(200,200,200,0.02)"
            ]
          }
        }
      },
      "valueAxis": {
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#cccccc"
          }
        },
        "axisTick": {
          "show": false,
          "lineStyle": {
            "color": "#333"
          }
        },
        "axisLabel": {
          "show": true,
          "color": "#999999"
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": [
              "#eeeeee"
            ]
          }
        },
        "splitArea": {
          "show": false,
          "areaStyle": {
            "color": [
              "rgba(250,250,250,0.05)",
              "rgba(200,200,200,0.02)"
            ]
          }
        }
      },
      "logAxis": {
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#cccccc"
          }
        },
        "axisTick": {
          "show": false,
          "lineStyle": {
            "color": "#333"
          }
        },
        "axisLabel": {
          "show": true,
          "color": "#999999"
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": [
              "#eeeeee"
            ]
          }
        },
        "splitArea": {
          "show": false,
          "areaStyle": {
            "color": [
              "rgba(250,250,250,0.05)",
              "rgba(200,200,200,0.02)"
            ]
          }
        }
      },
      "timeAxis": {
        "axisLine": {
          "show": true,
          "lineStyle": {
            "color": "#cccccc"
          }
        },
        "axisTick": {
          "show": false,
          "lineStyle": {
            "color": "#333"
          }
        },
        "axisLabel": {
          "show": true,
          "color": "#999999"
        },
        "splitLine": {
          "show": true,
          "lineStyle": {
            "color": [
              "#eeeeee"
            ]
          }
        },
        "splitArea": {
          "show": false,
          "areaStyle": {
            "color": [
              "rgba(250,250,250,0.05)",
              "rgba(200,200,200,0.02)"
            ]
          }
        }
      },
      "toolbox": {
        "iconStyle": {
          "borderColor": "#999"
        },
        "emphasis": {
          "iconStyle": {
            "borderColor": "#666"
          }
        }
      },
      "legend": {
        "textStyle": {
          "color": "#999999"
        }
      },
      "tooltip": {
        "axisPointer": {
          "lineStyle": {
            "color": "#ccc",
            "width": 1
          },
          "crossStyle": {
            "color": "#ccc",
            "width": 1
          }
        }
      },
      "timeline": {
        "lineStyle": {
          "color": "#8fd3e8",
          "width": 1
        },
        "itemStyle": {
          "color": "#8fd3e8",
          "borderWidth": 1
        },
        "controlStyle": {
          "color": "#8fd3e8",
          "borderColor": "#8fd3e8",
          "borderWidth": 0.5
        },
        "checkpointStyle": {
          "color": "#8fd3e8",
          "borderColor": "#8a7ca8"
        },
        "label": {
          "color": "#8fd3e8"
        },
        "emphasis": {
          "itemStyle": {
            "color": "#8fd3e8"
          },
          "controlStyle": {
            "color": "#8fd3e8",
            "borderColor": "#8fd3e8",
            "borderWidth": 0.5
          },
          "label": {
            "color": "#8fd3e8"
          }
        }
      },
      "visualMap": {
        "color": [
          "#FFFFFF",
          "#59c4e6",
          "#a5e7f0"
        ]
      },
      "dataZoom": {
        "backgroundColor": "rgba(0,0,0,0)",
        "dataBackgroundColor": "rgba(255,255,255,0.3)",
        "fillerColor": "rgba(167,183,204,0.4)",
        "handleColor": "#a7b7cc",
        "handleSize": "100%",
        "textStyle": {
          "color": "#333"
        }
      },
      "markPoint": {
        "label": {
          "color": "#eee"
        },
        "emphasis": {
          "label": {
            "color": "#eee"
          }
        }
      }
    };

    echarts.registerTheme('westeros', themeData); // Registrar o tema
  }

  initChart() {
    if (this.chartContainer) {
      this.chartInstance = echarts.init(this.chartContainer.nativeElement, 'westeros'); // Usar o tema registrado
      const chartOption = this.getChartOptions();
      this.chartInstance.setOption(chartOption);
    }
  }

  updateChart() {
    if (this.chartInstance) {
      const chartOption = this.getChartOptions();
      this.chartInstance.setOption(chartOption);
    }
  }

  getChartOptions() {
    switch (this.graphType) {
      case 'month':
        return this.getBarChartOptions(this.graphData);
      case 'lineChart':
        return this.getLineChartOptions(this.graphData);
      case 'pie':
        return this.getPieChartOptions(this.graphData);
      case 'stackedBar':
        return this.getStackedBarChartOptions(this.graphData);
      case 'barComparison':
        return this.getBarComparisonChartOptions(this.graphData);
      default:
        return {};
    }
  }

  getBarChartOptions(data: any) {
    return {
      title: {
        text: this.graphLabel,
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data,
        type: 'bar'
      }]
    };
  }

  getLineChartOptions(data: any) {
    return {
      title: {
        text: this.graphLabel,
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Ano Atual',
          data: data.recordsAnual,
          type: 'line'
        },
        {
          name: 'Ano Anterior',
          data: data.recordsAnualLastYear,
          type: 'line'
        }
      ]
    };
  }

  getPieChartOptions(data: any) {
    return {
      title: {
        text: this.graphLabel,
      },
      series: [
        {
          name: 'Comparação Anual',
          type: 'pie',
          data: [
            { value: data.previousYearTotal, name: 'Ano Anterior' },
            { value: data.currentYearTotal, name: 'Ano Atual' }
          ]
        }
      ]
    };
  }

  getStackedBarChartOptions(data: any) {
    return {
      title: {
        text: this.graphLabel,
      },
      xAxis: {
        type: 'category',
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Produção',
          type: 'bar',
          stack: 'total',
          data: data.recordsAnual
        },
        {
          name: 'Metas',
          type: 'bar',
          stack: 'total',
          data: data.goalsMensal
        }
      ]
    };
  }

  getBarComparisonChartOptions(data: any) {
    return {
      title: {
        text: this.graphLabel,
      },
      xAxis: {
        type: 'category',
        data: ['Ano Anterior', 'Ano Atual'],
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [data.goalAnual, data.currentYearTotal],
        type: 'bar'
      }]
    };
  }
}