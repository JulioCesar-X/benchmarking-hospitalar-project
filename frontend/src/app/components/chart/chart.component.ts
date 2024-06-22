import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  title = 'ng-chart';
  chart: any = [];

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {}
  @Input({required:true}) graphType: string = "";
  @Input({required:true}) graphLabel: string = "";

  ngOnInit() {
    if(this.graphType == "month"){
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          datasets: [
            {
              label: this.graphLabel,
              data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
              borderWidth: 1,
              backgroundColor: '#D2E8ED', //global style
              borderColor: '#D2E8ED', //global style
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else if (this.graphType == "year"){
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Produção', 'Meta'],
          datasets: [
            {
              label: this.graphLabel,
              data: [340, 250,],
              borderWidth: 1,
              backgroundColor: '#D2E8ED', //global style
              borderColor: '#D2E8ED', //global style
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      //Deixar um grafico formatar para mostrar os 5 anos mais recentes
    } else if (this.graphType == "homologYear"){
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['previousYear', 'CurrentYear'],
          datasets: [
            {
              label: this.graphLabel,
              data: [340, 250,],
              borderWidth: 1,
              backgroundColor: '#D2E8ED', //global style
              borderColor: '#D2E8ED', //global style
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else if (this.graphType == "fiveYear"){
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['CurrentYear', 'year2', 'year3', 'year3', 'year4'],
          datasets: [
            {
              label: this.graphLabel,
              data: [340, 250, 500, 300, 320],
              borderWidth: 1,
              backgroundColor: '#D2E8ED', //global style
              borderColor: '#D2E8ED', //global style
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } else if(this.graphType == "lineChart") {
      this.chart = new Chart(this.canvasRef.nativeElement, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          datasets: [
            {
              label: this.graphLabel,
              data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
              borderWidth: 1,
              backgroundColor: '#D2E8ED', //global style
              borderColor: '#D2E8ED', //global style
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
    } 
}
