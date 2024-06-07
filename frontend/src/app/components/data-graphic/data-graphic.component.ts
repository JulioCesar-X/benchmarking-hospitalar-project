import { Component, OnInit, Input, OnChanges, SimpleChanges, input } from '@angular/core';
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
  @Input({required: true}) typeOfGraph: string = "";
  @Input() homologueYear: string = "";
  

  constructor() { }

  ngOnInit(): void {
    this.updateDataHTML();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['data']) {
      this.updateDataHTML();
    }
  }

  updateDataHTML(): void {
    this.dataHTML = [];
    
    if(this.typeOfGraph === "month"){
      this.monthGraphPlaceholder()
    }  else {
      this.yearGraphPlaceholder();
    }

    for (const item of this.data) {
    
      const index = this.typeOfGraph === "month" ? 
        this.dataHTML.findIndex(obj => obj.month === this.adaptMonth(item.month)) :
        this.dataHTML.findIndex(obj => obj.year === item.year);

      console.log(index)
      

      if (item.value > 0 && index !== -1) {
        this.dataHTML[index] = {
          month: this.adaptMonth(item.month),
          activity: item.activity,
          year: item.year,
          indicator: item.indicator,
          value: item.value
        };
      }
    }
    this.dataHTML = this.normalizeData(this.dataHTML);

    console.log("RECEiBED DATA:", this.data)
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

  monthGraphPlaceholder(){
    this.dataHTML = [
      { activity: "", indicator: "", value: 0, month: "Jan", year: "" },
      { activity: "", indicator: "", value: 0, month: "Feb", year: "" },
      { activity: "", indicator: "", value: 0, month: "Mar", year: "" },
      { activity: "", indicator: "", value: 0, month: "Apr", year: "" },
      { activity: "", indicator: "", value: 0, month: "May", year: "" },
      { activity: "", indicator: "", value: 0, month: "Jun", year: "" },
      { activity: "", indicator: "", value: 0, month: "Jul", year: "" },
      { activity: "", indicator: "", value: 0, month: "Aug", year: "" },
      { activity: "", indicator: "", value: 0, month: "Sep", year: "" },
      { activity: "", indicator: "", value: 0, month: "Oct", year: "" },
      { activity: "", indicator: "", value: 0, month: "Nov", year: "" },
      { activity: "", indicator: "", value: 0, month: "Dec", year: "" }
    ]
  }

  yearGraphPlaceholder(){
    //placeholder para 5 anos
    const year = parseInt(this.homologueYear);

    for (let i = 0; i < 5; i++) {
      this.dataHTML.push({ activity: "", indicator: "", value: 0, month: "", year: (year - i).toString() });
    }
  }
}
