import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { graphData } from '../../models/graphData.model';

@Component({
  selector: 'app-data-graphic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-graphic.component.html',
  styleUrls: ['./data-graphic.component.scss']
})

//cenas do OnInit em principio podem ser apagadas. Ou mantidas - pode ser preciso + tarde
export class DataGraphicComponent implements OnInit, OnChanges {
  dataHTML: Array<graphData> = [];

  @Input({required: true}) data: Array<graphData> = [];
  @Input() homologueYear: string | undefined;

  constructor() { }

  ngOnInit(): void {
    this.updateDataHTML();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetDataHTML();
    if (changes['data']) {
      this.updateDataHTML();
    }
  }

  updateDataHTML(): void {

    for (const item of this.data) {
      const index = this.dataHTML.findIndex(obj => obj.month === this.adaptMonth(item.month));

      if (item.value > 0 && index !== -1) {
        this.dataHTML[index] = {
          month: this.adaptMonth(item.month),
          activity: item.activity,

          indicator: item.indicator,
          value: item.value
        };
      }
    }
    this.dataHTML = this.normalizeData(this.dataHTML);
    console.log("NORMALIZED DATA:", this.dataHTML)
  }

  adaptMonth(month: string): string {
    // Change number month to a word (assuming month is in numeric format like "1", "2", etc.)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthIndex = parseInt(month, 10) - 1;
    return monthNames[monthIndex] || month;
  }

  normalizeData(data: Array<graphData>): Array<graphData> {
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    if (range === 0 && min === 0) {
      return data.map(item => ({ ...item, value: 1 }));
    }

    return data.map(item => {
      const normalizedValue = range === 0 ? 100 : ((item.value - min) / range) * 99 + 1;
      return { ...item, value: normalizedValue };
    });
  }

  resetDataHTML(){
    this.dataHTML = [
      { activity: "", indicator: "", value: 0, month: "Jan" },
      { activity: "", indicator: "", value: 0, month: "Feb" },
      { activity: "", indicator: "", value: 0, month: "Mar" },
      { activity: "", indicator: "", value: 0, month: "Apr" },
      { activity: "", indicator: "", value: 0, month: "May" },
      { activity: "", indicator: "", value: 0, month: "Jun" },
      { activity: "", indicator: "", value: 0, month: "Jul" },
      { activity: "", indicator: "", value: 0, month: "Aug" },
      { activity: "", indicator: "", value: 0, month: "Sep" },
      { activity: "", indicator: "", value: 0, month: "Oct" },
      { activity: "", indicator: "", value: 0, month: "Nov" },
      { activity: "", indicator: "", value: 0, month: "Dec" }
    ]
  }

}
