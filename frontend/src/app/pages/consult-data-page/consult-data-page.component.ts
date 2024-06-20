import { Component } from '@angular/core';
import { ConsultDataFilterComponent } from '../../components/consult-data-filter/consult-data-filter.component'
import {DataGraphicComponent } from '../../components/data-graphic/data-graphic.component'
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { AccumulatedData } from '../../models/AccumulatedData.model'
import { Filter } from '../../models/Filter.model'
import {graphData} from '../../models/graphData.model'
import { PdfExportService } from '../../services/pdf-export-service';
import { ExcelExportService } from '../../services/excel-export-service.service';

@Component({
  selector: 'app-consult-data-page',
  standalone: true,
  imports: [
    ConsultDataFilterComponent,
    DataGraphicComponent,
    HttpClientModule,
  ],
  templateUrl: './consult-data-page.component.html',
  styleUrl: './consult-data-page.component.scss'
})

export class ConsultDataPageComponent {
   
  title = 'angular-pdf-export';
  Title = 'angular-excel-export';

  requestedData: any;
  filteredData: any;


  data: Array<graphData> = [];
  year: string = "";
  homologData: Array<graphData> = [];
  yearlyData: Array<graphData> = [];
  homologueYear: string = "";

  filter: Filter = {
    indicatorId: "Consultas Marcadas e não Realizadas",
    activityId: "Psiquiatria Infância e Adolescência",
    serviceId: "Hospital Dia",
    month: 1, /* new Date().getMonth().toString(), */
    year: (new Date().getFullYear() - 1)
  }

  graphData: Array<graphData>[] = [];

  constructor(private dataService: DataService, private pdfExportService: PdfExportService, private excelExportService: ExcelExportService) {};

  public exportToPDF(): void {
    this.pdfExportService.exportToPDF('contentToConvert', 'sample.pdf');
  }

  public exportJson(): void {
    const sampleJson = [
      { name: 'John', age: 30, city: 'New York', location: 'Europe' },
      { name: 'Anna', age: 22, city: 'London', location: 'Europe'},
      { name: 'Mike', age: 32, city: 'Chicago', location: 'Europe'}
    ];

    this.excelExportService.exportJsonToExcel(sampleJson, 'sample');
  }

  ngOnInit(): void {
    this.dataService.getAccumulatedIndicatorData().subscribe(
      (response) => {
        this.requestedData = response;
        this.updateAllGraphData();
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  handleFilterData(event: Filter) {
    this.filter = event;
    this.updateAllGraphData();
  }

  updateAllGraphData(){
    this.data = this.filterData(this.filter, this.data, "month");
    this.homologData = this.filterData(this.getHomologueFilter(this.filter), this.homologData, "month");

    this.yearlyData = this.getYearlyData(this.filter);
    console.log("YEAR", this.yearlyData)


    this.year = this.filter.year.toString();
    this.homologueYear = this.getHomologueFilter(this.filter).year.toString();
    console.log("HOMOLOG FILTER", this.getHomologueFilter(this.filter));
  }


  filterData(filter: Filter, listData: Array<graphData>, chartType:string): Array<graphData>{
    let filteredData: Array<graphData> = [];

    // Convert the requested data to the format needed for graphing
    this.requestedData.forEach((item: any) => {

      filteredData.push({
        activity: item.nome_da_atividade,
        indicator: item.nome_do_indicador,
        value: chartType === "month" ? parseFloat(item.valor_mensal) : parseFloat(item.valor_acumulado_agregado),
        month: item.month,
        year: item.year,
      });
    });



/*     console.log("DADOS PARA FILTRAR", filteredData) */

    //filtrar lista para grafico
    filteredData = filteredData.filter((item: graphData) => {
      let shouldInclude: boolean;

      if (chartType === "month") {
        shouldInclude = (
          (!filter.indicatorId || filter.indicatorId === item.indicator) &&
          (!filter.activityId || filter.activityId === item.activity) &&
          (!filter.year || filter.year.toString() === item.year)
        );
      } else {
        shouldInclude = (
          (!filter.indicatorId || filter.indicatorId === item.indicator) &&
          (!filter.activityId || filter.activityId === item.activity) &&
          (!filter.month || filter.month.toString() === item.month) &&
          (!filter.year || filter.year.toString() === item.year)
        );
      }

      return shouldInclude;
    });



/*     this.filteredData.forEach((item: AccumulatedData) => {

      data = this.filteredData.map((item: any) => ({
        activity: item.nome_da_atividade,
        indicator: item.nome_do_indicador,
        value: parseFloat(item.valor_mensal),
        month: item.month,
      }));
    }); */

    console.log('DADOS PARA APRESENTAR:', filteredData);
    return filteredData;
  }


  getYearlyData(filter: Filter): any {
    let data: Array<graphData> = [];

    const filterYear = filter.year;

    for (let i = 0; i < 5; i++) {
      filter = {
        ...filter,
        month : 12,
        year : (filterYear - i),
      }

      data.push(...this.filterData(filter, this.yearlyData, "year"));
    }

    return data;
}

  getHomologueFilter(filter: Filter): Filter {
    const currentYear = filter.year;
    const previousYear = currentYear - 1;
    return {
      ...filter,
      year: previousYear
    };
  }
}
